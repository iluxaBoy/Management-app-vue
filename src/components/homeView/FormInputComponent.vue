<script setup lang="ts">
import { ref } from 'vue'
// Stores
import { useDataStore } from '@/stores/data'
// Types
import type { Project } from '@/types/dataTypes'
import { TaskStatus } from '@/types/enumsUse'

const dataStore = useDataStore()

const dialogRef = ref<HTMLDialogElement>()

defineExpose({
  showDialog: () => dialogRef.value?.showModal(),
  closeDialog: () => dialogRef.value?.close(),
})

const errorMessage = ref('')

const projectForm = ref<Project>({
  id: Date.now() as number,
  name: '',
  status: TaskStatus.TO_DO,
  createdAt: '',
  description: '',
  tasksAmount: 0,
})

const getCurrentDate = () => {
  const date = new Date(Date.now())

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${day}-${month}-${year}`
}

const closeDialog = () => {
  errorMessage.value = ''
  projectForm.value = {
    id: Date.now() as number,
    name: '',
    status: TaskStatus.TO_DO,
    createdAt: '',
    description: '',
    tasksAmount: 0,
  }
  dialogRef.value?.close()
}

const addProject = () => {
  if (!projectForm.value) return

  if (!projectForm.value.name.trim()) {
    errorMessage.value = 'Project name is required'
    return
  }
  errorMessage.value = ''

  projectForm.value.createdAt = getCurrentDate()
  dataStore.addProject(projectForm.value)
  closeDialog()
}
</script>

<template>
  <dialog
    ref="dialogRef"
    class="app-dialog"
  >
    <div class="p-6 pb-0 flex justify-between items-center">
      <h3 class="text-xl font-bold text-slate-800 m-0">Add New Project</h3>
      <button
        @click="closeDialog"
        class="text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
      >
        X
      </button>
    </div>

    <form
      @submit.prevent="addProject"
      v-if="projectForm"
    >
      <div>
        <label for="name">Project Name</label>
        <input
          v-model="projectForm.name"
          type="text"
          id="name"
          name="name"
          class="input-field"
          :class="{ '!border-red-500 !focus:ring-red-500': errorMessage }"
          placeholder="Enter project name"
          @input="errorMessage = ''"
        />
        <span
          v-if="errorMessage"
          class="text-red-500 text-sm mt-1 block"
          >{{ errorMessage }}</span
        >
      </div>

      <div>
        <label for="description">Project Description</label>
        <textarea
          v-model="projectForm.description"
          id="description"
          name="description"
          class="input-field"
          rows="3"
          placeholder="Enter description"
        ></textarea>
      </div>

      <div class="dialog-actions">
        <button
          type="button"
          @click="closeDialog"
          class="btn btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="btn btn-primary"
        >
          Add Project
        </button>
      </div>
    </form>
  </dialog>
</template>
