import type { LeadTask, LeadTaskFilter, LeadTaskStatus } from '@/modules/leads/types'

export const getLeadTaskStatus = (task: Pick<LeadTask, 'completed' | 'dueAt'>, now = Date.now()): LeadTaskStatus => {
  if (task.completed) return 'completed'
  return new Date(task.dueAt).getTime() < now ? 'overdue' : 'pending'
}

export const LEAD_TASK_STATUS_LABELS: Record<LeadTaskStatus, string> = {
  pending: 'Pendiente',
  completed: 'Completado',
  overdue: 'Atrasado'
}

export const LEAD_TASK_FILTER_OPTIONS: { value: LeadTaskFilter, label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'completed', label: 'Completados' },
  { value: 'overdue', label: 'Atrasados' }
]

export const filterLeadTasks = (tasks: LeadTask[], filter: LeadTaskFilter): LeadTask[] => {
  if (filter === 'all') return tasks
  return tasks.filter((task) => getLeadTaskStatus(task) === filter)
}

export const buildDueAtIso = (date: string, time: string): string | null => {
  const trimmedDate = date.trim()
  const trimmedTime = time.trim()
  if (!trimmedDate || !trimmedTime) return null
  const value = new Date(`${trimmedDate}T${trimmedTime}`)
  if (Number.isNaN(value.getTime())) return null
  return value.toISOString()
}

export const splitDueAt = (dueAt: string): { date: string, time: string } => {
  const value = new Date(dueAt)
  const year = value.getFullYear()
  const month = `${value.getMonth() + 1}`.padStart(2, '0')
  const day = `${value.getDate()}`.padStart(2, '0')
  const hours = `${value.getHours()}`.padStart(2, '0')
  const minutes = `${value.getMinutes()}`.padStart(2, '0')
  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`
  }
}

export const defaultTaskDueTime = (): string => '09:00'

export const defaultTaskDueDate = (): string => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return splitDueAt(tomorrow.toISOString()).date
}
