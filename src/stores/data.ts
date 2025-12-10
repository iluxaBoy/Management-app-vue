import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue'
// Types
import { TaskStatus } from '@/types/enumsUse'
import { NotificationType } from '@/types/enumsUse'
import type { Project, Task } from '@/types/dataTypes'
// Utils
import { postDataProjects, postDataTasks, putDataTasks, putDataProjects } from '@/utils/dataFetching'
import db from '../../db.json'

export const useDataStore = defineStore('data', () => {
  const projectsData = ref<Project[]>([])
  const tasksData = ref<Task[]>([])
  const notification = ref({
    show: false,
    message: '',
    type: NotificationType.SUCCESS,
  })

  const showNotification = (message: string, type: NotificationType = NotificationType.SUCCESS) => {
    notification.value = {
      show: true,
      message,
      type,
    }
    setTimeout(() => {
      notification.value.show = false
    }, 3000)
  }

  const getDataFromStorage = () => {
    const storedProjects = localStorage.getItem('projectsData')
    const storedTasks = localStorage.getItem('tasksData')

    if (storedProjects) {
      projectsData.value = JSON.parse(storedProjects)
    } else {
      projectsData.value = db.projects as unknown as Project[]
      localStorage.setItem('projectsData', JSON.stringify(projectsData.value))
    }

    if (storedTasks) {
      tasksData.value = JSON.parse(storedTasks)
    } else {
      tasksData.value = db.tasks as unknown as Task[]
      localStorage.setItem('tasksData', JSON.stringify(tasksData.value))
    }
  }

  const addProject = (project: Project) => {
    projectsData.value.push(project)
    localStorage.setItem('projectsData', JSON.stringify([...projectsData.value]))
    postDataProjects(project)
    showNotification('Project added successfully')
  }

  const addTask = (task: Task) => {
    tasksData.value.push(task)
    localStorage.setItem('tasksData', JSON.stringify([...tasksData.value]))
    postDataTasks(task)
    showNotification('Task added successfully')
  }

  const updateTaskStatus = (task: Task) => {
    const index = tasksData.value.findIndex((t) => t.id === task.id)

    if (index !== -1) {
      tasksData.value[index] = task
      localStorage.setItem('tasksData', JSON.stringify([...tasksData.value]))
      putDataTasks(tasksData.value[index])
      showNotification('Task updated successfully')
    }
  }

  const updateProjectStatus = (project: Project, status: TaskStatus) => {
    const index = projectsData.value.findIndex((p) => p.id === project.id)
    if (index !== -1) {
      projectsData.value[index] = {
        ...project,
        status,
      }
      localStorage.setItem('projectsData', JSON.stringify([...projectsData.value]))
      putDataProjects(projectsData.value[index])
      showNotification('Project updated successfully')
    }
  }

  onMounted(() => {
    getDataFromStorage()
  })
  return {
    projectsData,
    tasksData,
    notification,
    addProject,
    addTask,
    updateTaskStatus,
    updateProjectStatus,
    showNotification,
  }
})
