<template>
  <div class="state-box">
    <v-icon :size="72" :color="iconColor">{{ icon }}</v-icon>
    <h2 class="text-h6 font-weight-bold mt-4">{{ title }}</h2>
    <p v-if="subtitle" class="text-medium-emphasis mb-4">{{ subtitle }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string
    iconColor?: string
    title: string
    subtitle?: string
  }>(),
  {
    icon: 'mdi-rocket-launch-outline',
    iconColor: 'grey',
    subtitle: '',
  },
)
</script>

<style scoped>
.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 64px 16px;
}
</style>
