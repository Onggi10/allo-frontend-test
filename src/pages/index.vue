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
          :model-value="store.search"
          theme="light"
          placeholder="Cari roket berdasarkan nama..."
          prepend-inner-icon="mdi-magnify"
          variant="solo"
          rounded="pill"
          clearable
          hide-details
          class="search-field"
          @update:model-value="store.setSearch($event ?? '')"
        />
      </v-container>
    </section>

    <v-container max-width="1200" class="py-8">
      <!-- Toolbar -->
      <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
        <div class="text-body-1 font-weight-medium">
          <template v-if="!store.loading && !store.error">
            {{ store.filteredRockets.length }} roket ditemukan
          </template>
          <template v-else>&nbsp;</template>
        </div>

        <div class="d-flex ga-2 flex-wrap">
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="showAddDialog = true"
          >
            Tambah roket
          </v-btn>
          <v-btn
            variant="tonal"
            color="primary"
            prepend-icon="mdi-refresh"
            :loading="store.loading"
            @click="store.fetchRockets"
          >
            Refresh
          </v-btn>
        </div>
      </div>

      <!-- Loading (skeleton) -->
      <v-row v-if="store.loading && !store.hasLoaded">
        <v-col v-for="n in 6" :key="n" cols="12" sm="6" lg="4">
          <v-skeleton-loader type="image, article, actions" class="rounded-xl" />
        </v-col>
      </v-row>

      <!-- Error -->
      <RocketState
        v-else-if="store.error"
        icon="mdi-cloud-alert-outline"
        icon-color="error"
        title="Gagal memuat data roket"
        subtitle="Periksa koneksi internet kamu lalu coba lagi."
      >
        <v-btn color="primary" prepend-icon="mdi-reload" @click="store.fetchRockets">
          Coba lagi
        </v-btn>
      </RocketState>

      <!-- Empty -->
      <RocketState
        v-else-if="store.filteredRockets.length === 0"
        title="Roket tidak ditemukan"
        subtitle="Coba gunakan kata kunci lain."
      >
        <v-btn variant="tonal" @click="store.setSearch('')">Reset pencarian</v-btn>
      </RocketState>

      <!-- List -->
      <v-row v-else>
        <v-col
          v-for="rocket in store.filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          lg="4"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>
    </v-container>

    <AddRocketDialog v-model:open="showAddDialog" @submit="handleAdd" />

    <v-snackbar v-model="snackbar" color="success" timeout="3000">
      Roket "{{ lastAddedName }}" berhasil ditambahkan.
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRocketsStore, type NewRocketInput } from '@/stores/rockets'
import RocketCard from '@/components/rockets/RocketCard.vue'
import RocketState from '@/components/rockets/RocketState.vue'
import AddRocketDialog from '@/components/rockets/AddRocketDialog.vue'

const store = useRocketsStore()
const showAddDialog = ref(false)
const snackbar = ref(false)
const lastAddedName = ref('')

function handleAdd(input: NewRocketInput) {
  const rocket = store.addRocket(input)
  lastAddedName.value = rocket.full_name || 'Baru'
  snackbar.value = true
}

onMounted(() => {
  if (!store.hasLoaded && store.rockets.length === 0) {
    store.fetchRockets()
  }
})
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
</style>
