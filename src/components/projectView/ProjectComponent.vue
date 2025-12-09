<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
// Composables
import { useFilterData } from '@/composables/useFilterData'
// Stores
import { useDataStore } from '@/stores/data'
// Application
import { VueDraggableNext as draggable } from 'vue-draggable-next'
// Components
import TaskFormInput from './TaskFormInput.vue'
// Types
import { SortBy, TaskStatus, View } from '@/types/enumsUse'
import type { Task } from '@/types/dataTypes'

interface DragChangeEvent<T = Task> {
  added?: {
    newIndex: number
    element: T
  }
}

const emit = defineEmits<{
  (e: 'project', id: number): void
}>()

const { filteredTask, getTasks } = useFilterData()
const dataStore = useDataStore()
const route = useRoute()

const searchQuery = ref('')
const sortBy = ref<SortBy>((localStorage.getItem('sortBy') as SortBy) || SortBy.ID)
const view = ref<View>(localStorage.getItem('view') === View.KANBAN ? View.KANBAN : View.TABLE)

const showForm = ref<InstanceType<typeof TaskFormInput>>()

const projectId = computed(() => Number(route.params.id))
const tasks = ref<Task[]>(getTasks(projectId.value))
const filteredTasks = ref<Task[]>(filteredTask(searchQuery.value, sortBy.value, tasks.value))
const kanbanTask = reactive({
  todo: [] as Task[],
  inProgress: [] as Task[],
  done: [] as Task[],
})

const openForm = () => showForm.value?.showDialog()

const updateKanbanTask = () => {
  kanbanTask.todo = filteredTasks.value.filter((task) => task.status === TaskStatus.TO_DO)
  kanbanTask.inProgress = filteredTasks.value.filter(
    (task) => task.status === TaskStatus.IN_PROGRESS,
  )
  kanbanTask.done = filteredTasks.value.filter((task) => task.status === TaskStatus.COMPLETED)
}

const findProject = () => dataStore.projectsData.find((project) => project.id == projectId.value)

const updateData = () => {
  tasks.value = getTasks(projectId.value)
  filteredTasks.value = filteredTask(searchQuery.value, sortBy.value, tasks.value)

  const project = findProject()
  if (!project) return

  const tasksStatus = tasks.value.map((task) => task.status)
  let newStatus: TaskStatus | undefined

  if (tasksStatus.includes(TaskStatus.TO_DO) && !tasksStatus.includes(TaskStatus.IN_PROGRESS)) {
    newStatus = TaskStatus.TO_DO
  } else if (tasksStatus.includes(TaskStatus.IN_PROGRESS)) {
    newStatus = TaskStatus.IN_PROGRESS
  } else if (tasksStatus.every((status) => status === TaskStatus.COMPLETED)) {
    newStatus = TaskStatus.COMPLETED
  }

  if (newStatus && project.status !== newStatus) {
    dataStore.updateProjectStatus({ ...project }, newStatus)
  }

  localStorage.setItem('view', view.value)
  localStorage.setItem('sortBy', sortBy.value)
}

watch(
  [dataStore.tasksData, searchQuery, sortBy, view],
  () => {
    updateData()
    updateKanbanTask()
  },
  { deep: true, immediate: true },
)

const changeStatus = (task: DragChangeEvent, status: TaskStatus) => {
  if (task.added?.element) {
    task.added.element.status = status
    dataStore.updateTaskStatus(task.added.element)
    updateKanbanTask()
  }
}

const todo = (task: DragChangeEvent) => changeStatus(task, TaskStatus.TO_DO)

const inProgress = (task: DragChangeEvent) => changeStatus(task, TaskStatus.IN_PROGRESS)

const completed = (task: DragChangeEvent) => changeStatus(task, TaskStatus.COMPLETED)

onMounted(() => {
  view.value = localStorage.getItem('view') === View.KANBAN ? View.KANBAN : View.TABLE
  sortBy.value = (localStorage.getItem('sortBy') as SortBy) || SortBy.ID
  emit('project', projectId.value)
  updateKanbanTask()
})
</script>

<template>
  <div class="card h-full flex flex-col">
    <h2 class="text-2xl font-bold m-0">Tasks</h2>
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div class="flex items-center gap-4 flex-1 w-full">
        <div class="flex flex-col items-start gap-2">
          <label
            for="view"
            class="font-medium text-slate-600"
            >View:</label
          >
          <select
            v-model="view"
            name="view"
            id="view"
            class="input-field w-auto py-1"
          >
            <option :value="View.TABLE">Table</option>
            <option :value="View.KANBAN">Kanban</option>
          </select>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
        <div class="flex flex-col items-start gap-2 w-full md:w-auto">
          <label
            for="search"
            class="font-medium text-slate-600 whitespace-nowrap"
            >Search:</label
          >
          <input
            type="text"
            id="search"
            v-model="searchQuery"
            class="input-field"
            placeholder="Search tasks..."
          />
        </div>
        <div class="flex flex-col items-start gap-2 w-full md:w-auto">
          <label
            for="sort"
            class="font-medium text-slate-600 whitespace-nowrap"
            >Sort by:</label
          >
          <select
            id="sort"
            v-model="sortBy"
            class="input-field"
          >
            <option :value="SortBy.ID">ID</option>
            <option :value="SortBy.NAME">Name</option>
            <option :value="SortBy.PERFORMER">Performer</option>
            <option :value="SortBy.STATUS">Status</option>
            <option :value="SortBy.DEADLINE">Deadline</option>
          </select>
        </div>
        <button
          @click="openForm"
          class="btn btn-primary whitespace-nowrap"
        >
          Add Task
        </button>
      </div>
    </div>

    <!-- Table View -->
    <table
      v-if="view === View.TABLE"
      class="app-table"
    >
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Performer</th>
          <th>Status</th>
          <th>Deadline</th>
        </tr>
      </thead>
      <draggable
        v-model="filteredTasks"
        tag="tbody"
        item-key="id"
      >
        <tr
          v-for="task in filteredTasks"
          :key="task.id"
          class="cursor-pointer"
        >
          <td>{{ task.id }}</td>
          <td>{{ task.name }}</td>
          <td>{{ task.performer }}</td>
          <td>
            <span
              class="status-badge"
              :class="{
                'status-badge-todo': task.status === TaskStatus.TO_DO,
                'status-badge-inprogress': task.status === TaskStatus.IN_PROGRESS,
                'status-badge-completed': task.status === TaskStatus.COMPLETED,
              }"
            >
              {{ task.status }}
            </span>
          </td>
          <td>{{ task.deadline }}</td>
        </tr>
      </draggable>
    </table>

    <!-- Kanban View -->
    <div
      v-if="view === View.KANBAN"
      class="flex flex-col md:flex-row w-full h-full gap-6 overflow-x-auto pb-4"
    >
      <div class="kanban-column bg-slate-50">
        <h3 class="kanban-header border-l-4 border-slate-400">To Do</h3>
        <div class="kanban-list">
          <draggable
            v-model="kanbanTask.todo"
            tag="div"
            group="tasks"
            item-key="id"
            animation="100"
            @change="todo"
            class="min-h-[200px]"
          >
            <div
              v-for="task in kanbanTask.todo"
              :key="task.id"
              class="kanban-card"
            >
              <p class="font-medium text-slate-800">{{ task.name }}</p>
              <div class="flex justify-between items-center mt-2 text-xs text-slate-500">
                <span>{{ task.performer }}</span>
                <span>{{ task.deadline }}</span>
              </div>
            </div>
          </draggable>
        </div>
      </div>

      <div class="kanban-column bg-blue-50">
        <h3 class="kanban-header border-l-4 border-blue-500">In Progress</h3>
        <div class="kanban-list">
          <draggable
            v-model="kanbanTask.inProgress"
            tag="div"
            group="tasks"
            item-key="id"
            animation="100"
            @change="inProgress"
            class="min-h-[200px]"
          >
            <div
              v-for="task in kanbanTask.inProgress"
              :key="task.id"
              class="kanban-card border-l-2 border-blue-200"
            >
              <p class="font-medium text-slate-800">{{ task.name }}</p>
              <div class="flex justify-between items-center mt-2 text-xs text-slate-500">
                <span>{{ task.performer }}</span>
                <span>{{ task.deadline }}</span>
              </div>
            </div>
          </draggable>
        </div>
      </div>

      <div class="kanban-column bg-green-50">
        <h3 class="kanban-header border-l-4 border-green-500">Completed</h3>
        <div class="kanban-list">
          <draggable
            v-model="kanbanTask.done"
            tag="div"
            group="tasks"
            item-key="id"
            animation="100"
            @change="completed"
            class="min-h-[200px]"
          >
            <div
              v-for="task in kanbanTask.done"
              :key="task.id"
              class="kanban-card border-l-2 border-green-200"
            >
              <p class="font-medium text-slate-800 line-through text-slate-400">{{ task.name }}</p>
              <div class="flex justify-between items-center mt-2 text-xs text-slate-400">
                <span>{{ task.performer }}</span>
                <span>{{ task.deadline }}</span>
              </div>
            </div>
          </draggable>
        </div>
      </div>
    </div>
  </div>
  <TaskFormInput
    ref="showForm"
    :projectId="projectId"
  />
</template>

<style scoped lang="scss">
@reference "../../assets/main.scss";

.kanban-column {
  @apply flex-1 rounded-xl p-4 min-w-[300px] flex flex-col;
}

.kanban-header {
  @apply text-lg font-bold mb-4 pl-3 py-1;
}

.kanban-list {
  @apply flex-1;
}

.kanban-card {
  @apply bg-white p-4 mb-3 rounded-lg shadow-sm border border-slate-100 cursor-move transition-all duration-200;

  &:hover {
    @apply shadow-md transform -translate-y-1;
  }
}
</style>
