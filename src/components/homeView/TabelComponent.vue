<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
// Composables
import { useFilterData } from '@/composables/useFilterData'
import { useDataStore } from '@/stores/data'
// Components
import FormInputComponent from '@/components/homeView/FormInputComponent.vue'
// Types
import { SortBy } from '@/types/enumsUse'
import type { Project } from '@/types/dataTypes'

const { getTaskAmount, filteredProject } = useFilterData()
const dataStore = useDataStore()
const router = useRouter()

const showForm = ref<InstanceType<typeof FormInputComponent>>()

const sortBy = ref<SortBy>((localStorage.getItem('sortBy') as SortBy) || SortBy.ID)
const searchQuery = ref('')

const filteredProjectData = ref<Project[]>(filteredProject(searchQuery.value, sortBy.value))

const openForm = () => showForm.value?.showDialog()

watch([dataStore.projectsData, sortBy, searchQuery], () => {
  filteredProjectData.value = filteredProject(searchQuery.value, sortBy.value)

  localStorage.setItem('sortBy', sortBy.value)
})

const goToProject = (projectId: number) => router.push(`/project/${projectId}`)

onMounted(() => {
  sortBy.value = (localStorage.getItem('sortBy') as SortBy) || SortBy.ID
})
</script>

<template>
  <div
    v-if="dataStore.projectsData.length > 0"
    class="card"
  >
    <div class="flex justify-between items-end mb-6">
      <div class="flex gap-4 items-end flex-1">
        <div class="flex flex-col items-start gap-2">
          <label
            for="sort"
            class="font-medium text-slate-600"
            >Sort by:</label
          >
          <select
            v-model="sortBy"
            class="input-field w-auto"
          >
            <option :value="SortBy.ID">ID</option>
            <option :value="SortBy.NAME">Name</option>
            <option :value="SortBy.TASK_AMOUNT">Task Amount</option>
            <option :value="SortBy.STATUS">Status</option>
          </select>
        </div>
        <div class="flex flex-col items-start gap-2">
          <label
            for="searchQuery"
            class="font-medium text-slate-600"
            >Search:</label
          >
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search projects..."
            class="input-field max-w-xs"
          />
        </div>
      </div>
      <button
        @click="openForm"
        class="btn btn-primary"
      >
        Add Project
      </button>
    </div>
    <table class="app-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Project Name</th>
          <th>Task Amount</th>
          <th>Status</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody v-if="dataStore.projectsData.length > 0">
        <tr
          v-for="project in filteredProjectData"
          :key="project.id"
          @click="goToProject(project.id)"
          class="cursor-pointer"
        >
          <td>{{ project.id }}</td>
          <td>{{ project.name }}</td>
          <td>{{ getTaskAmount(project.id) }}</td>
          <td>
            <span
              class="status-badge"
              :class="{
                'status-badge-todo': project.status === 'To Do',
                'status-badge-inprogress': project.status === 'In Progress',
                'status-badge-completed': project.status === 'Completed',
              }"
            >
              {{ project.status }}
            </span>
          </td>
          <td>{{ project.createdAt || 'N/A' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <FormInputComponent ref="showForm" />
</template>
