import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue'
// Types
import { TaskStatus } from '@/types/enumsUse'
import { NotificationType } from '@/types/enumsUse'
import type { Project, Task } from '@/types/dataTypes'
// Applications
import axios from 'axios'

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
    projectsData.value = JSON.parse(localStorage.getItem('projectsData') || '[]')
    tasksData.value = JSON.parse(localStorage.getItem('tasksData') || '[]')
  }

  const API_BASE_URL = 'http://localhost:3000'

  const postDataProjects = async (project: Project) => {
    try {
      await axios.post(`${API_BASE_URL}/projects`, { ...project, id: String(project.id) })
    } catch (error) {
      console.error('Error posting project:', error)
      showNotification('Error posting project', NotificationType.ERROR)
    }
  }

  const postDataTasks = async (task: Task) => {
    try {
      await axios.post(`${API_BASE_URL}/tasks`, { ...task, id: String(task.id) })
    } catch (error) {
      console.error('Error posting task:', error)
      showNotification('Error posting task', NotificationType.ERROR)
    }
  }

  const putDataTasks = async (task: Task) => {
    try {
      const { data } = await axios.get<Task[]>(`${API_BASE_URL}/tasks?id=${task.id}`)

      const taskExists = Array.isArray(data) && data.some((t) => String(t.id) === String(task.id))

      if (taskExists) {
        await axios.put(`${API_BASE_URL}/tasks/${task.id}`, { ...task, id: String(task.id) })
      } else {
        console.warn(`Task ${task.id} not found on server. Creating it...`)
        await postDataTasks(task)
      }
    } catch (error) {
      console.error('Error updating task:', error)
      showNotification('Error updating task', NotificationType.ERROR)
    }
  }

  const putDataProjects = async (project: Project) => {
    try {
      const { data } = await axios.get<Project[]>(`${API_BASE_URL}/projects?id=${project.id}`)

      const projectExists =
        Array.isArray(data) && data.some((p) => String(p.id) === String(project.id))

      if (projectExists) {
        await axios.put(`${API_BASE_URL}/projects/${project.id}`, {
          ...project,
          id: String(project.id),
        })
      } else {
        console.warn(`Project ${project.id} not found on server. Creating it...`)
        await postDataProjects(project)
      }
    } catch (error) {
      console.error('Error updating project:', error)
      showNotification('Error updating project', NotificationType.ERROR)
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
  }
})
