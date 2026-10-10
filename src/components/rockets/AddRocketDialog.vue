<template>
  <v-dialog v-model="open" max-width="600" scrollable>
    <v-card rounded="xl">
      <v-card-title class="d-flex align-center justify-space-between pa-5 pb-2">
        <span class="text-h6 font-weight-bold">Tambah roket baru</span>
        <v-btn icon="mdi-close" variant="text" size="small" @click="close" />
      </v-card-title>

      <v-card-subtitle class="px-5">
        API bersifat read-only, roket baru hanya tersimpan selama aplikasi berjalan.
      </v-card-subtitle>

      <v-card-text class="px-5 pt-4">
        <v-form ref="formRef" @submit.prevent="submit">
          <v-text-field
            v-model="form.full_name"
            label="Nama roket *"
            placeholder="cth. Falcon Heavy Custom"
            :rules="[rules.required]"
            variant="outlined"
            class="mb-2"
          />

          <v-textarea
            v-model="form.description"
            label="Deskripsi"
            placeholder="Deskripsi singkat roket..."
            variant="outlined"
            rows="3"
            auto-grow
            class="mb-2"
          />

          <v-text-field
            v-model="form.image_url"
            label="URL gambar"
            placeholder="https://..."
            :rules="[rules.url]"
            variant="outlined"
            class="mb-2"
          />

          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="form.launch_cost"
                label="Biaya per peluncuran (USD)"
                placeholder="cth. 62000000"
                type="number"
                min="0"
                :rules="[rules.nonNegative]"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.country_code"
                label="Kode negara"
                placeholder="cth. USA"
                variant="outlined"
                counter="3"
              />
            </v-col>
          </v-row>

          <v-text-field
            v-model="form.maiden_flight"
            label="Penerbangan perdana"
            type="date"
            variant="outlined"
            hint="Opsional"
            persistent-hint
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="px-5 pb-5">
        <v-spacer />
        <v-btn variant="text" @click="close">Batal</v-btn>
        <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" @click="submit">
          Tambah roket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { VForm } from 'vuetify/components'

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  submit: [value: {
    full_name: string
    description?: string | null
    image_url?: string | null
    launch_cost?: number | null
    country_code?: string | null
    maiden_flight?: string | null
  }]
}>()

const formRef = ref<VForm | null>(null)

const form = reactive({
  full_name: '',
  description: '',
  image_url: '',
  launch_cost: null as number | null,
  country_code: '',
  maiden_flight: '',
})

const rules = {
  required: (v: string) => (!!v && !!v.trim()) || 'Nama roket wajib diisi',
  url: (v: string) => {
    if (!v || !v.trim()) return true
    try {
      const url = new URL(v.trim())
      return (url.protocol === 'http:' || url.protocol === 'https:') || 'URL harus diawali http(s)://'
    } catch {
      return 'URL tidak valid'
    }
  },
  nonNegative: (v: number | null) =>
    v == null || Number(v) >= 0 || 'Biaya tidak boleh negatif',
}

function reset() {
  form.full_name = ''
  form.description = ''
  form.image_url = ''
  form.launch_cost = null
  form.country_code = ''
  form.maiden_flight = ''
  formRef.value?.resetValidation()
}

function close() {
  open.value = false
}

async function submit() {
  const result = await formRef.value?.validate()
  if (!result?.valid) return

  emit('submit', {
    full_name: form.full_name,
    description: form.description || null,
    image_url: form.image_url || null,
    launch_cost: form.launch_cost ?? null,
    country_code: form.country_code || null,
    maiden_flight: form.maiden_flight || null,
  })
  reset()
  close()
}
</script>
