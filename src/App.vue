<script setup lang="ts">
import { onMounted } from 'vue'
// Components
import NotificationComponent from '@/components/common/NotificationComponent.vue'
// Utils
import { fetchProjects, fetchTasks } from '@/utils/dataFetching'

const fetchData = async () => {
  await Promise.all([fetchProjects(), fetchTasks()])
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <router-view></router-view>
  <NotificationComponent />
</template>
