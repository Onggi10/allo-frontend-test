<template>
  <v-container max-width="1100" class="py-6 py-md-10">
    <v-btn
      prepend-icon="mdi-arrow-left"
      variant="text"
      class="mb-4"
      to="/"
    >
      Kembali ke daftar roket
    </v-btn>

    <!-- Loading -->
    <v-row v-if="loading">
      <v-col cols="12" md="6">
        <v-skeleton-loader type="image" height="420" class="rounded-xl" />
      </v-col>
      <v-col cols="12" md="6">
        <v-skeleton-loader type="heading, paragraph, paragraph, list-item-two-line" />
      </v-col>
    </v-row>

    <!-- Error -->
    <RocketState
      v-else-if="error"
      icon="mdi-cloud-alert-outline"
      icon-color="error"
      title="Gagal memuat detail roket"
      subtitle="Silakan coba lagi."
    >
      <v-btn color="primary" prepend-icon="mdi-reload" @click="fetchRocket">
        Coba lagi
      </v-btn>
    </RocketState>

    <!-- Not found -->
    <RocketState
      v-else-if="!rocket"
      title="Data roket tidak tersedia"
    />

    <!-- Success -->
    <v-row v-else align="stretch">
      <v-col cols="12" md="6">
        <v-card rounded="xl" border elevation="0" class="image-card h-100">
          <v-img
            :src="rocket.image_url || undefined"
            height="100%"
            min-height="320"
            max-height="560"
            cover
            color="grey-lighten-3"
          >
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-icon size="80" color="grey">mdi-rocket-launch-outline</v-icon>
              </div>
            </template>
            <template #error>
              <div class="d-flex align-center justify-center fill-height">
                <v-icon size="80" color="grey">mdi-rocket-launch-outline</v-icon>
              </div>
            </template>
          </v-img>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-chip
          color="primary"
          variant="tonal"
          size="small"
          prepend-icon="mdi-rocket-launch"
          class="mb-3"
        >
          SpaceX Rocket
        </v-chip>

        <v-chip
          v-if="rocket.isLocal"
          color="success"
          variant="tonal"
          size="small"
          class="mb-3 ml-2"
        >
          Added by you
        </v-chip>

        <h1 class="text-h4 text-md-h3 font-weight-bold mb-4">
          {{ rocket.full_name || 'Unnamed rocket' }}
        </h1>

        <p class="text-body-1 text-medium-emphasis mb-6">
          {{ rocket.description || 'No description available.' }}
        </p>

        <h2 class="text-h6 font-weight-bold mb-3">Informasi roket</h2>

        <RocketDetailStats :rocket="rocket" />

        <v-btn
          color="primary"
          size="large"
          rounded="pill"
          prepend-icon="mdi-arrow-left"
          class="mt-8"
          to="/"
        >
          Lihat roket lainnya
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { Rocket } from '@/types/rocket'
import { useRocketsStore } from '@/stores/rockets'
import RocketState from '@/components/rockets/RocketState.vue'
import RocketDetailStats from '@/components/rockets/RocketDetailStats.vue'

const route = useRoute()
const store = useRocketsStore()

const rocket = ref<Rocket | null>(null)
const loading = ref(false)
const error = ref(false)

function isLocalId(id: string): boolean {
  return id.startsWith('local-')
}

async function fetchRocket() {
  const id = String(route.params.id || '')

  if (!id) {
    rocket.value = null
    error.value = true
    loading.value = false
    return
  }

  // 1. Locally added rockets live only in the Pinia store (API is read-only).
  const cached = store.getById(id)
  if (cached?.isLocal || isLocalId(id)) {
    rocket.value = cached ?? null
    error.value = cached ? false : true
    loading.value = false
    return
  }

  // 2. Prefer store cache for API rockets too (avoids a second network call
  //    when navigating from the list screen).
  if (cached && !cached.isLocal) {
    rocket.value = cached
    error.value = false
    loading.value = false
    // Refresh in background so detail stays fresh; failure keeps cached data.
    try {
      const response = await fetch(
        `https://lldev.thespacedevs.com/2.2.0/config/launcher/${encodeURIComponent(id)}/`,
      )
      if (response.ok) {
        rocket.value = (await response.json()) as Rocket
      }
    } catch (err) {
      console.error('Background refresh of rocket details failed:', err)
    }
    return
  }

  // 3. Direct visit / refresh: fetch single rocket from API.
  if (!/^\d+$/.test(id)) {
    rocket.value = null
    error.value = true
    loading.value = false
    return
  }

  loading.value = true
  error.value = false
  rocket.value = null

  try {
    const response = await fetch(
      `https://lldev.thespacedevs.com/2.2.0/config/launcher/${encodeURIComponent(id)}/`,
    )

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }

    rocket.value = (await response.json()) as Rocket
  } catch (err) {
    console.error('Failed to fetch rocket details:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(fetchRocket)

// Fetch again if the route ID changes without remounting.
watch(() => route.params.id, fetchRocket)
</script>

<style scoped>
.image-card {
  overflow: hidden;
}
</style>
