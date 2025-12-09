<script setup lang="ts">
import { onMounted } from 'vue'
// Stores
import { useDataStore } from '@/stores/data'
// Application
import axios from 'axios'
// Components
import NotificationComponent from '@/components/common/NotificationComponent.vue'

const dataStore = useDataStore()

const API_BASE_URL = 'http://localhost:3000'

const fetchProjects = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/projects/`)
    dataStore.projectsData = data
    localStorage.setItem('projectsData', JSON.stringify(data))
  } catch (err) {
    console.error('Failed to fetch projects:', err)
  }
}

const fetchTasks = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/tasks/`)
    dataStore.tasksData = data
    localStorage.setItem('tasksData', JSON.stringify(data))
  } catch (err) {
    console.error('Failed to fetch tasks:', err)
  }
}

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
