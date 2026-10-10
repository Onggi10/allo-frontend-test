
<template>
  <div>
    <!-- HERO -->
    <section class="hero">
      <v-container max-width="1200" class="py-12 py-md-16">
        <v-chip
          variant="outlined"
          size="small"
          prepend-icon="mdi-rocket-launch"
          class="mb-4 hero-chip"
        >
          SpaceX Collection
        </v-chip>

        <h1 class="text-h3 text-md-h2 font-weight-bold mb-3">
          Rocket Explorer
        </h1>

        <p class="text-body-1 text-md-h6 hero-subtitle mb-8">
          Jelajahi koleksi roket SpaceX lengkap dengan detail biaya dan penerbangan perdananya.
        </p>

        <v-text-field
          v-model="search"
          theme="light"
          placeholder="Cari roket berdasarkan nama..."
          prepend-inner-icon="mdi-magnify"
          variant="solo"
          rounded="pill"
          clearable
          hide-details
          class="search-field"
        />
      </v-container>
    </section>

    <v-container max-width="1200" class="py-8">
      <!-- Toolbar -->
      <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
        <div class="text-body-1 font-weight-medium">
          <template v-if="!loading && !error">
            {{ filteredRockets.length }} roket ditemukan
          </template>
          <template v-else>&nbsp;</template>
        </div>

        <v-btn
          variant="tonal"
          color="primary"
          prepend-icon="mdi-refresh"
          :loading="loading"
          @click="fetchRockets"
        >
          Refresh
        </v-btn>
      </div>

      <!-- Loading (skeleton) -->
      <v-row v-if="loading">
        <v-col v-for="n in 6" :key="n" cols="12" sm="6" lg="4">
          <v-skeleton-loader type="image, article, actions" class="rounded-xl" />
        </v-col>
      </v-row>

      <!-- Error -->
      <div v-else-if="error" class="state-box">
        <v-icon size="72" color="error">mdi-cloud-alert-outline</v-icon>
        <h2 class="text-h6 font-weight-bold mt-4">Gagal memuat data roket</h2>
        <p class="text-medium-emphasis mb-4">
          Periksa koneksi internet kamu lalu coba lagi.
        </p>
        <v-btn color="primary" prepend-icon="mdi-reload" @click="fetchRockets">
          Coba lagi
        </v-btn>
      </div>

      <!-- Empty -->
      <div v-else-if="filteredRockets.length === 0" class="state-box">
        <v-icon size="72" color="grey">mdi-rocket-launch-outline</v-icon>
        <h2 class="text-h6 font-weight-bold mt-4">Roket tidak ditemukan</h2>
        <p class="text-medium-emphasis mb-4">
          Coba gunakan kata kunci lain.
        </p>
        <v-btn variant="tonal" @click="search = ''">Reset pencarian</v-btn>
      </div>

      <!-- List -->
      <v-row v-else>
        <v-col
          v-for="rocket in filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          lg="4"
        >
          <v-card
            class="rocket-card h-100 d-flex flex-column"
            rounded="xl"
            border
            elevation="0"
            :to="`/rockets/${rocket.id}`"
          >
            <div class="card-media">
              <v-img
                :src="rocket.image_url || undefined"
                height="220"
                cover
                color="grey-lighten-3"
                gradient="to bottom, rgba(0,0,0,0) 55%, rgba(0,0,0,0.4)"
                class="card-img"
              >
                <template #placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-icon size="56" color="grey">mdi-rocket-launch-outline</v-icon>
                  </div>
                </template>
                <template #error>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-icon size="56" color="grey">mdi-rocket-launch-outline</v-icon>
                  </div>
                </template>
              </v-img>

              <v-chip
                v-if="rocket.launch_cost"
                class="card-chip"
                size="small"
                color="primary"
                variant="flat"
                prepend-icon="mdi-currency-usd"
              >
                {{ formatCost(rocket.launch_cost) }} / launch
              </v-chip>
            </div>

            <v-card-item>
              <v-card-title class="text-h6 font-weight-bold text-wrap">
                {{ rocket.full_name || 'Unnamed rocket' }}
              </v-card-title>
            </v-card-item>

            <v-card-text class="flex-grow-1">
              <p class="description text-body-2 text-medium-emphasis">
                {{ rocket.description || 'No description available.' }}
              </p>
            </v-card-text>

            <div class="px-4 pb-4 d-flex align-center text-primary font-weight-medium">
              Lihat detail
              <v-icon size="18" class="ml-1 arrow">mdi-arrow-right</v-icon>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

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

const API_URL =
  'https://lldev.thespacedevs.com/2.2.0/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20'

const rockets = ref<Rocket[]>([])
const search = ref('')
const loading = ref(false)
const error = ref(false)

function formatCost(cost?: number | null): string {
  if (cost == null) return 'N/A'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(cost)
}

const filteredRockets = computed(() => {
  const query = search.value.trim().toLowerCase()

  if (!query) return rockets.value

  return rockets.value.filter((rocket) => {
    const name = rocket.full_name || ''
    const description = rocket.description || ''

    return (
      name.toLowerCase().includes(query) ||
      description.toLowerCase().includes(query)
    )
  })
})

async function fetchRockets() {
  loading.value = true
  error.value = false

  try {
    const response = await fetch(API_URL)

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }

    const data = await response.json()
    rockets.value = Array.isArray(data.results) ? data.results : []
  } catch (err) {
    console.error('Failed to fetch rockets:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(fetchRockets)
</script>

<style scoped>
.hero {
  background:
    radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.35), transparent 45%),
    radial-gradient(circle at 80% 70%, rgba(14, 165, 233, 0.3), transparent 45%),
    linear-gradient(135deg, #0b1020 0%, #121a3a 100%);
  color: #fff;
}

.hero-subtitle {
  max-width: 640px;
  opacity: 0.85;
}

.hero-chip {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.5);
}

.search-field {
  max-width: 640px;
}

.rocket-card {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.rocket-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15) !important;
}

.card-media {
  position: relative;
  overflow: hidden;
}

.card-img {
  transition: transform 0.4s ease;
}

.rocket-card:hover .card-img {
  transform: scale(1.06);
}

.card-chip {
  position: absolute;
  top: 12px;
  left: 12px;
}

.arrow {
  transition: transform 0.2s ease;
}

.rocket-card:hover .arrow {
  transform: translateX(4px);
}

.description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 60px;
}

.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 64px 16px;
}
</style>
