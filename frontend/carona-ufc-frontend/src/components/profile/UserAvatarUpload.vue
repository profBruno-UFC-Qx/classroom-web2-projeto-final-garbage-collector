<script setup lang="ts">
import { ref, computed } from 'vue'
import { User, Camera } from 'lucide-vue-next'

const props = defineProps({
  src: {
    type: String,
    default: null,
  },
  alt: {
    type: String,
    default: 'User Avatar',
  },
  size: {
    type: String,
    default: 'h-24 w-24',
  }
})

const emit = defineEmits(['update:image'])

const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref<string | null>(null)

const displayImage = computed(() => previewUrl.value || props.src)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const resetPreview = () => {
  previewUrl.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

defineExpose({
  resetPreview
})

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]

    const reader = new FileReader()
    reader.onload = (e) => {
      previewUrl.value = e.target?.result as string
    }
    reader.readAsDataURL(file)

    emit('update:image', file)
  }
}
</script>

<template>
  <div class="relative inline-block">
    <div
      class="group relative flex cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-gray-200 bg-gray-100 transition-all hover:border-gray-400"
      :class="size"
      @click="triggerFileInput"
      title="Alterar foto de perfil"
    >

      <img
        v-if="displayImage"
        :src="displayImage"
        :alt="alt"
        class="h-full w-full object-cover"
      />

      <div v-else class="flex h-full w-full items-center justify-center bg-blue-100 text-blue-600">
        <User :size="40" />
      </div>

      <div class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <Camera class="text-white" :size="24" />
      </div>

    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onFileChange"
    />
  </div>
</template>
