export interface RocketManufacturer {
  country_code?: string | null
  name?: string | null
}

export interface Rocket {
  id: string | number
  full_name?: string | null
  name?: string | null
  image_url?: string | null
  description?: string | null
  launch_cost?: number | null
  maiden_flight?: string | null
  manufacturer?: RocketManufacturer | null
  /** True when the rocket was added locally (API is read-only). */
  isLocal?: boolean
}

export interface RocketListResponse {
  results: Rocket[]
}
