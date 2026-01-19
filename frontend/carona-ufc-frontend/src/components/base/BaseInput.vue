<script setup lang="ts">
import { ref, computed, useSlots } from 'vue'

const model = defineModel<string | number>()
const showPassword = ref(false)
const slots = useSlots()

interface Props {
  label?: string
  id?: string
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  required: false,
  disabled: false
})

const inputType = computed(() => {
  if (props.type === 'password' && showPassword.value) return 'text'
  return props.type
})

const isPasswordField = computed(() => props.type === 'password')
const isTextarea = computed(() => props.type === 'textarea')
const hasIcon = computed(() => !!slots.icon)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="id"
      class="mb-1 block text-sm font-medium text-gray-700"
    >
      {{ label }}
    </label>

    <div class="relative">
      <div
        v-if="hasIcon"
        class="absolute left-3 text-gray-400 pointer-events-none"
        :class="isTextarea ? 'top-3' : 'top-1/2 -translate-y-1/2'"
      >
        <slot name="icon"></slot>
      </div>

      <textarea
        v-if="isTextarea"
        v-model="model"
        v-bind="$attrs"
        :id="id"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        class="
          block w-full rounded-md
          border border-gray-300
          py-2 text-sm shadow-sm
          transition-colors duration-200
          focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
        "
        :class="[
          hasIcon ? 'pl-10' : 'px-3',
          disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed opacity-60' : 'bg-white'
        ]"
      ></textarea>

      <input
        v-else
        v-model="model"
        v-bind="$attrs"
        :type="inputType"
        :id="id"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        class="
          block w-full rounded-md
          border border-gray-300
          py-2 text-sm shadow-sm
          transition-colors duration-200
          focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
        "
        :class="[
          hasIcon ? 'pl-10' : 'px-3',
          isPasswordField ? 'pr-10' : 'pr-3',
          disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed opacity-60' : 'bg-white'
        ]"
      >

      <button
        v-if="isPasswordField"
        type="button"
        @click="togglePasswordVisibility"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <component
          :is="showPassword ? 'svg' : 'svg'"
          class="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
           <path v-if="!showPassword" stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
           <path v-else stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        </component>
      </button>
    </div>

    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>
