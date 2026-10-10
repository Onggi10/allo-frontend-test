<template>
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
        v-if="rocket.launch_cost != null"
        class="card-chip"
        size="small"
        color="primary"
        variant="flat"
        prepend-icon="mdi-currency-usd"
      >
        {{ formatCostCompact(rocket.launch_cost) }} / launch
      </v-chip>

      <v-chip
        v-if="rocket.isLocal"
        class="local-chip"
        size="small"
        color="success"
        variant="flat"
      >
        Added by you
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
</template>

<script setup lang="ts">
import type { Rocket } from '@/types/rocket'
import { formatCostCompact } from '@/utils/format'

defineProps<{ rocket: Rocket }>()
</script>

<style scoped>
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

.local-chip {
  position: absolute;
  top: 12px;
  right: 12px;
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
</style>
