import { useDataStore } from '@/stores/data'

import { TaskStatus } from '@/types/enumsUse'
import type { Project, Task } from '@/types/dataTypes'

import { SortBy } from '@/types/enumsUse'

const getStatusPriority = (status: string) => {
  switch (status) {
    case TaskStatus.COMPLETED:
      return 1
    case TaskStatus.IN_PROGRESS:
      return 2
    case TaskStatus.TO_DO:
      return 3
    default:
      return 3
  }
}

export const useFilterData = () => {
  const dataStore = useDataStore()

  const getTasks = (projectId: number) =>
    [...dataStore.tasksData].filter((task: Task) => task.projectId == projectId)

  const getTaskAmount = (projectId: number): number =>
    [...dataStore.tasksData].filter((task: Task) => task.projectId == projectId).length

  const filteredProject = (searchQuery: string, sortBy: SortBy): Project[] => {
    if (searchQuery) {
      return [...dataStore.projectsData].filter((project: Project | Task) => {
        return (
          project.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })
    }

    return [...dataStore.projectsData].sort((a: Project, b: Project) => {
      switch (sortBy) {
        case SortBy.ID:
          return a.id - b.id
        case SortBy.NAME:
          return a.name.localeCompare(b.name)
        case SortBy.TASK_AMOUNT:
          return getTaskAmount(b.id) - getTaskAmount(a.id)
        case SortBy.STATUS:
          return getStatusPriority(a.status) - getStatusPriority(b.status)
        default:
          return a.id - b.id
      }
    })
  }

  const filteredTask = (searchQuery: string, sortBy: SortBy, data: Task[]): Task[] => {
    if (searchQuery) {
      return [...data].filter((task: Task) => {
        return (
          task.name.toLowerCase().includes(searchQuery.toLowerCase()) 
        )
      })
    }

    return [...data].sort((a: Task, b: Task) => {
      switch (sortBy) {
        case SortBy.ID:
          return a.id - b.id
        case SortBy.NAME:
          return a.name.localeCompare(b.name)
        case SortBy.PERFORMER:
          return a.performer.localeCompare(b.performer)
        case SortBy.STATUS:
          return getStatusPriority(a.status) - getStatusPriority(b.status)
        case SortBy.DEADLINE:
          return new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
        default:
          return a.id - b.id
      }
    })
  }

  return {
    getTaskAmount,
    filteredProject,
    filteredTask,
    getTasks,
  }
}
