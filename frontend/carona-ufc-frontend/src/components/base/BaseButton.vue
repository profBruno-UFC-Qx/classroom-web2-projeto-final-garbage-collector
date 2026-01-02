<script setup lang="ts">

defineProps({
  type: {
    type: String as () => 'button' | 'submit' | 'reset',
    default: 'button',
  },
  variant: {
    type: String,
    default: 'primary',
  },
})

</script>

<template>
  <button
    :type="type"
    class="
      inline-flex w-full items-center justify-center gap-2
      rounded-md bg-gray-900 px-6 py-3
      font-medium text-white
      transition-colors duration-200
      hover:bg-gray-700
      focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2
      disabled:opacity-50
    "
  >
    <slot />
  </button>
</template>
