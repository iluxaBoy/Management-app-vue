<script setup lang="ts">
import { computed } from 'vue'
// Stores
import { useDataStore } from '@/stores/data'
// Types
import { NotificationType } from '@/types/enumsUse'

const dataStore = useDataStore()

const notification = computed(() => dataStore.notification)

const typeClasses = computed(() => {
  switch (notification.value.type) {
    case NotificationType.SUCCESS:
      return 'bg-green-500 text-white'
    case NotificationType.ERROR:
      return 'bg-red-500 text-white'
    case NotificationType.INFO:
      return 'bg-blue-500 text-white'
    default:
      return 'bg-gray-500 text-white'
  }
})
</script>

<template>
  <Transition name="fade">
    <div
      v-if="notification.show"
      class="fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2"
      :class="typeClasses"
    >
      <span>{{ notification.message }}</span>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
