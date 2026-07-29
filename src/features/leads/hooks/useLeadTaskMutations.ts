import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateLeadTaskInput, LeadTask } from '@/modules/leads/types'
import { leadService, type LeadWithRelations } from '@/shared/services/leadService'
import { queryKeys } from '@/shared/queryKeys'

const invalidateTaskQueries = (queryClient: ReturnType<typeof useQueryClient>, leadId?: string) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.leads.pendingTasks(5) })
  queryClient.invalidateQueries({ queryKey: queryKeys.leads.overdueTaskCount })
  queryClient.invalidateQueries({ queryKey: ['activity'] })
  if (leadId) {
    queryClient.invalidateQueries({ queryKey: queryKeys.leads.detail(leadId) })
  }
}

const patchLeadDetailTasks = (
  queryClient: ReturnType<typeof useQueryClient>,
  leadId: string,
  updater: (tasks: LeadTask[]) => LeadTask[]
) => {
  queryClient.setQueryData<LeadWithRelations | null>(queryKeys.leads.detail(leadId), (current) => {
    if (!current) return current
    return { ...current, tasks: updater(current.tasks) }
  })
}

interface CreateTaskVariables extends CreateLeadTaskInput {}

interface CompleteTaskVariables {
  leadId: string
  taskId: string
}

interface DeleteTaskVariables {
  leadId: string
  task: LeadTask
}

export const useLeadTaskMutations = () => {
  const queryClient = useQueryClient()

  const createTask = useMutation({
    mutationFn: (input: CreateTaskVariables) => leadService.createTask(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.leads.detail(input.leadId) })
      const previous = queryClient.getQueryData<LeadWithRelations | null>(queryKeys.leads.detail(input.leadId))
      const optimisticTask: LeadTask = {
        id: `optimistic_${Date.now()}`,
        dealerId: input.dealerId,
        leadId: input.leadId,
        title: input.title,
        notes: input.notes,
        dueAt: input.dueAt,
        completed: false,
        completedAt: null,
        createdAt: new Date().toISOString()
      }
      patchLeadDetailTasks(queryClient, input.leadId, (tasks) => [...tasks, optimisticTask])
      return { previous, leadId: input.leadId }
    },
    onError: (_error, input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.leads.detail(input.leadId), context.previous)
      }
    },
    onSuccess: (task) => invalidateTaskQueries(queryClient, task.leadId)
  })

  const completeTask = useMutation({
    mutationFn: ({ taskId }: CompleteTaskVariables) => leadService.completeTask(taskId),
    onMutate: async ({ leadId, taskId }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.leads.detail(leadId) })
      const previous = queryClient.getQueryData<LeadWithRelations | null>(queryKeys.leads.detail(leadId))
      const completedAt = new Date().toISOString()
      patchLeadDetailTasks(queryClient, leadId, (tasks) =>
        tasks.map((task) =>
          task.id === taskId ? { ...task, completed: true, completedAt } : task
        )
      )
      return { previous, leadId }
    },
    onError: (_error, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.leads.detail(variables.leadId), context.previous)
      }
    },
    onSuccess: (task) => invalidateTaskQueries(queryClient, task.leadId)
  })

  const deleteTask = useMutation({
    mutationFn: ({ task }: DeleteTaskVariables) => leadService.deleteTask(task),
    onMutate: async ({ leadId, task }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.leads.detail(leadId) })
      const previous = queryClient.getQueryData<LeadWithRelations | null>(queryKeys.leads.detail(leadId))
      patchLeadDetailTasks(queryClient, leadId, (tasks) => tasks.filter((item) => item.id !== task.id))
      return { previous, leadId }
    },
    onError: (_error, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.leads.detail(variables.leadId), context.previous)
      }
    },
    onSuccess: (_result, variables) => invalidateTaskQueries(queryClient, variables.leadId)
  })

  return { createTask, completeTask, deleteTask }
}
