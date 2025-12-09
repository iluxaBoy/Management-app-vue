import { TaskStatus } from './enumsUse'

export interface Data {
  id: number
  name: string
  status: TaskStatus
}

export interface Project extends Data {
  createdAt: string
  description: string
  tasksAmount: number
}

export interface Task extends Data {
  projectId: number
  performer: string
  deadline: string
}
