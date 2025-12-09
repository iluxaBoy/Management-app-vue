<script setup lang="ts">
import { ref } from 'vue'
// Stores
import { useDataStore } from '@/stores/data'
// Types
import type { Task } from '@/types/dataTypes'
import { TaskStatus } from '@/types/enumsUse'

const dataStore = useDataStore()

const dialogRef = ref<HTMLDialogElement>()

const props = defineProps<{
  projectId: number
}>()

const errorMessage = ref({
  name: '',
  status: '',
})

const taskForm = ref<Task>({
  id: Date.now() as number,
  projectId: props.projectId,
  name: '',
  performer: '',
  deadline: '',
  status: TaskStatus.TO_DO,
})

defineExpose({
  showDialog: () => dialogRef.value?.showModal(),
  closeDialog: () => dialogRef.value?.close(),
})

const closeDialog = () => {
  errorMessage.value = {
    name: '',
    status: '',
  }
  taskForm.value = {
    id: Date.now() as number,
    projectId: props.projectId,
    name: '',
    performer: '',
    deadline: '',
    status: TaskStatus.TO_DO,
  }
  dialogRef.value?.close()
}

const validation = () => {
  let isValid = true

  const name = taskForm.value.name.trim()
  if (!name) {
    errorMessage.value.name = 'Task name is required'
    isValid = false
  } else if (name.length < 3) {
    errorMessage.value.name = 'Task name must be at least 3 characters'
    isValid = false
  } else if (name.length > 130) {
    errorMessage.value.name = 'Task name must be less than 130 characters'
    isValid = false
  }

  if (!taskForm.value.status) {
    errorMessage.value.status = 'Task status is required'
    isValid = false
  }

  if (!isValid) return
}

const addTask = () => {
  if (!taskForm.value) return

  validation()

  if (!errorMessage.value.name && !errorMessage.value.status) {
    dataStore.addTask(taskForm.value)
    closeDialog()
  }
}
</script>

<template>
  <dialog
    ref="dialogRef"
    class="app-dialog"
  >
    <div class="p-6 pb-0 flex justify-between items-center">
      <h3 class="text-xl font-bold text-slate-800 m-0">Add New Task</h3>
      <button
        @click="closeDialog"
        class="text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
      >
        X
      </button>
    </div>

    <form
      @submit.prevent="addTask"
      v-if="taskForm"
    >
      <div>
        <label for="name">Task Name</label>
        <input
          v-model="taskForm.name"
          type="text"
          id="name"
          name="name"
          class="input-field"
          :class="{ '!border-red-500 !focus:ring-red-500': errorMessage.name }"
          @input="errorMessage.name = ''"
        />
        <span
          v-if="errorMessage.name"
          class="text-red-500 text-sm mt-1 block"
          >{{ errorMessage.name }}</span
        >
      </div>

      <div>
        <label for="performer">Task Performer</label>
        <input
          v-model="taskForm.performer"
          type="text"
          id="performer"
          name="performer"
          class="input-field"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="status">Task Status</label>
          <select
            v-model="taskForm.status"
            class="input-field"
            :class="{ '!border-red-500 !focus:ring-red-500': errorMessage.status }"
            @change="errorMessage.status = ''"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <span
            v-if="errorMessage.status"
            class="text-red-500 text-sm mt-1 block"
            >{{ errorMessage.status }}</span
          >
        </div>

        <div>
          <label for="deadline">Task Deadline</label>
          <input
            v-model="taskForm.deadline"
            type="date"
            id="deadline"
            name="deadline"
            class="input-field"
          />
        </div>
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
          Add Task
        </button>
      </div>
    </form>
  </dialog>
</template>
