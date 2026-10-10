import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Rocket, RocketListResponse } from '@/types/rocket'

const API_URL =
  'https://lldev.thespacedevs.com/2.2.0/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20'

let localIdCounter = 0

function createLocalId(): string {
  localIdCounter += 1
  return `local-${Date.now()}-${localIdCounter}`
}

export interface NewRocketInput {
  full_name: string
  description?: string | null
  image_url?: string | null
  launch_cost?: number | null
  country_code?: string | null
  maiden_flight?: string | null
}

export const useRocketsStore = defineStore('rockets', () => {
  const rockets = ref<Rocket[]>([])
  const loading = ref(false)
  const error = ref(false)
  const search = ref('')
  const hasLoaded = ref(false)

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

  function getById(id: string | number): Rocket | undefined {
    return rockets.value.find((r) => String(r.id) === String(id))
  }

  async function fetchRockets() {
    // Keep user-added rockets across refresh/retry.
    const localRockets = rockets.value.filter((r) => r.isLocal)

    loading.value = true
    error.value = false

    try {
      const response = await fetch(API_URL)
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`)
      }
      const data = (await response.json()) as RocketListResponse
      const remote = Array.isArray(data.results) ? data.results : []
      rockets.value = [...localRockets, ...remote]
      hasLoaded.value = true
    } catch (err) {
      console.error('Failed to fetch rockets:', err)
      // If we never loaded anything, surface the error state.
      // Otherwise keep showing cached data (incl. local rockets).
      if (!hasLoaded.value && localRockets.length === 0) {
        error.value = true
      }
    } finally {
      loading.value = false
    }
  }

  function addRocket(input: NewRocketInput): Rocket {
    const rocket: Rocket = {
      id: createLocalId(),
      full_name: input.full_name.trim(),
      description: input.description?.trim() || null,
      image_url: input.image_url?.trim() || null,
      launch_cost: input.launch_cost ?? null,
      maiden_flight: input.maiden_flight || null,
      manufacturer: input.country_code?.trim()
        ? { country_code: input.country_code.trim(), name: 'Custom' }
        : null,
      isLocal: true,
    }
    rockets.value = [rocket, ...rockets.value]
    return rocket
  }

  function setSearch(value: string) {
    search.value = value
  }

  return {
    rockets,
    loading,
    error,
    search,
    hasLoaded,
    filteredRockets,
    getById,
    fetchRockets,
    addRocket,
    setSearch,
  }
})
