export enum SortBy {
  ID = 'id',
  NAME = 'name',
  TASK_AMOUNT = 'taskAmount',
  STATUS = 'status',
  PERFORMER = 'performer',
  DEADLINE = 'deadline',
}

export enum View {
  TABLE = 'Table',
  KANBAN = 'Kanban',
}

export enum TaskStatus {
  TO_DO = 'To Do',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
}

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
}
