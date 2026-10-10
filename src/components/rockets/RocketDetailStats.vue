<template>
  <v-row dense>
    <v-col cols="12" sm="4">
      <div class="stat-card">
        <v-avatar color="primary" variant="tonal" size="40" class="mb-2">
          <v-icon>mdi-currency-usd</v-icon>
        </v-avatar>
        <div class="stat-label">Biaya per peluncuran</div>
        <div class="stat-value">{{ formatCostFull(rocket.launch_cost) }}</div>
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
</template>

<script setup lang="ts">
import type { Rocket } from '@/types/rocket'
import { formatCostFull, formatDate } from '@/utils/format'

defineProps<{ rocket: Rocket }>()
</script>

<style scoped>
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
</style>
