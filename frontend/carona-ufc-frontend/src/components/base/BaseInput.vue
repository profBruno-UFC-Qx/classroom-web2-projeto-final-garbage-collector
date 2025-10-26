<script setup lang="ts">

const model = defineModel<string | number>()

defineProps({
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'text',
  },
  id: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false
  },
})

</script>

<template>
  <div class="w-full">
    <label
      :for="id"
      class="block text-sm font-medium text-gray-700"
    >
      {{ label }}
    </label>

    <input
      v-model="model"
      :type="type"
      :id="id"
      :name="id"
      :placeholder="placeholder"
      :required="required"
      class="
        mt-1 block w-full rounded-md border-gray-300 px-3 py-2
        shadow-sm transition-colors duration-200
        focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
      "
    >
  </div>
</template>
