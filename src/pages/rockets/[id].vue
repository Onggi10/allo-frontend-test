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
    <div v-else-if="error" class="state-box">
      <v-icon size="72" color="error">mdi-cloud-alert-outline</v-icon>
      <h2 class="text-h6 font-weight-bold mt-4">Gagal memuat detail roket</h2>
      <p class="text-medium-emphasis mb-4">Silakan coba lagi.</p>
      <v-btn color="primary" prepend-icon="mdi-reload" @click="fetchRocket">
        Coba lagi
      </v-btn>
    </div>

    <!-- Not found -->
    <div v-else-if="!rocket" class="state-box">
      <v-icon size="72" color="grey">mdi-rocket-launch-outline</v-icon>
      <h2 class="text-h6 font-weight-bold mt-4">Data roket tidak tersedia</h2>
    </div>

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

        <h1 class="text-h4 text-md-h3 font-weight-bold mb-4">
          {{ rocket.full_name || 'Unnamed rocket' }}
        </h1>

        <p class="text-body-1 text-medium-emphasis mb-6">
          {{ rocket.description || 'No description available.' }}
        </p>

        <h2 class="text-h6 font-weight-bold mb-3">Informasi roket</h2>

        <v-row dense>
          <v-col cols="12" sm="4">
            <div class="stat-card">
              <v-avatar color="primary" variant="tonal" size="40" class="mb-2">
                <v-icon>mdi-currency-usd</v-icon>
              </v-avatar>
              <div class="stat-label">Biaya per peluncuran</div>
              <div class="stat-value">{{ formatCost(rocket.launch_cost) }}</div>
            </div>
          </v-col>

          <v-col cols="12" sm="4">
            <div class="stat-card">
              <v-avatar color="primary" variant="tonal" size="40" class="mb-2">
                <v-icon>mdi-earth</v-icon>
              </v-avatar>
              <div class="stat-label">Negara</div>
              <div class="stat-value">
                {{ rocket.manufacturer?.country_code || 'Not available' }}
              </div>
            </div>
          </v-col>

          <v-col cols="12" sm="4">
            <div class="stat-card">
              <v-avatar color="primary" variant="tonal" size="40" class="mb-2">
                <v-icon>mdi-calendar</v-icon>
              </v-avatar>
              <div class="stat-label">Penerbangan perdana</div>
              <div class="stat-value">{{ formatDate(rocket.maiden_flight) }}</div>
            </div>
          </v-col>
        </v-row>

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

<style scoped>
.image-card {
  overflow: hidden;
}

.stat-card {
  height: 100%;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgb(var(--v-theme-surface));
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.1);
}

.stat-label {
  font-size: 0.75rem;
  opacity: 0.65;
  margin-bottom: 2px;
}

.stat-value {
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.3;
}

.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 64px 16px;
}
</style>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

interface Rocket {
  id: string | number
  full_name?: string | null
  image_url?: string | null
  description?: string | null
  launch_cost?: number | null
  maiden_flight?: string | null
  manufacturer?: {
    country_code?: string | null
  } | null
}

const route = useRoute()

const rocket = ref<Rocket | null>(null)
const loading = ref(false)
const error = ref(false)

function formatCost(cost?: number | null): string {
  if (cost == null) return 'Not available'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(cost)
}

function formatDate(date?: string | null): string {
  if (!date) return 'Not available'

  const parsed = new Date(date)

  if (Number.isNaN(parsed.getTime())) return date

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(parsed)
}

async function fetchRocket() {
  const id = String(route.params.id || '')

  if (!id || !/^\d+$/.test(id)) {
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

    rocket.value = await response.json()
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
