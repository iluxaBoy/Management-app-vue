// Types
import type { Project, Task } from '@/types/dataTypes'
import { NotificationType } from '@/types/enumsUse'
// Store
import { useDataStore } from '@/stores/data'
// Application
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export const fetchProjects = async () => {
  const dataStore = useDataStore()
  if (!import.meta.env.VITE_API_BASE_URL && import.meta.env.PROD) return
  try {
    const { data } = await axios.get(`${API_BASE_URL}/projects/`)
    dataStore.projectsData = data
    localStorage.setItem('projectsData', JSON.stringify(data))
  } catch (err) {
    console.error('Failed to fetch projects:', err)
  }
}

export const fetchTasks = async () => {
  const dataStore = useDataStore()
  if (!import.meta.env.VITE_API_BASE_URL && import.meta.env.PROD) return
  try {
    const { data } = await axios.get(`${API_BASE_URL}/tasks/`)
    dataStore.tasksData = data
    localStorage.setItem('tasksData', JSON.stringify(data))
  } catch (err) {
    console.error('Failed to fetch tasks:', err)
  }
}

export const postDataProjects = async (project: Project) => {
  const dataStore = useDataStore()
  if (!import.meta.env.VITE_API_BASE_URL && import.meta.env.PROD) return
  try {
    await axios.post(`${API_BASE_URL}/projects`, { ...project, id: String(project.id) })
  } catch (error) {
    console.error('Error posting project:', error)
    dataStore.showNotification('Error posting project', NotificationType.ERROR)
  }
}

export const postDataTasks = async (task: Task) => {
  const dataStore = useDataStore()
  if (!import.meta.env.VITE_API_BASE_URL && import.meta.env.PROD) return
  try {
    await axios.post(`${API_BASE_URL}/tasks`, { ...task, id: String(task.id) })
  } catch (error) {
    console.error('Error posting task:', error)
    dataStore.showNotification('Error posting task', NotificationType.ERROR)
  }
}

export const putDataTasks = async (task: Task) => {
  const dataStore = useDataStore()
  if (!import.meta.env.VITE_API_BASE_URL && import.meta.env.PROD) return
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
    dataStore.showNotification('Error updating task', NotificationType.ERROR)
  }
}

export const putDataProjects = async (project: Project) => {
  const dataStore = useDataStore()
  if (!import.meta.env.VITE_API_BASE_URL && import.meta.env.PROD) return
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
    dataStore.showNotification('Error updating project', NotificationType.ERROR)
  }
}
