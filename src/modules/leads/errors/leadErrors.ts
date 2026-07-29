export class LeadRepositoryError extends Error {
  readonly code = 'LEAD_REPOSITORY_ERROR'

  constructor(message: string, public readonly cause?: unknown) {
    super(message)
    this.name = 'LeadRepositoryError'
  }
}

export class LeadNotesRepositoryError extends Error {
  readonly code = 'LEAD_NOTES_REPOSITORY_ERROR'

  constructor(message: string, public readonly cause?: unknown) {
    super(message)
    this.name = 'LeadNotesRepositoryError'
  }
}

export class LeadMessagesRepositoryError extends Error {
  readonly code = 'LEAD_MESSAGES_REPOSITORY_ERROR'

  constructor(message: string, public readonly cause?: unknown) {
    super(message)
    this.name = 'LeadMessagesRepositoryError'
  }
}

export class LeadTasksRepositoryError extends Error {
  readonly code = 'LEAD_TASKS_REPOSITORY_ERROR'

  constructor(message: string, public readonly cause?: unknown) {
    super(message)
    this.name = 'LeadTasksRepositoryError'
  }
}

export class LeadServiceError extends Error {
  readonly code = 'LEAD_SERVICE_ERROR'

  constructor(message: string, public readonly cause?: unknown) {
    super(message)
    this.name = 'LeadServiceError'
  }
}

export const assertLeadRepositorySuccess = (error: { message: string } | null, context: string): void => {
  if (error) throw new LeadRepositoryError(`${context}: ${error.message}`, error)
}

export const assertLeadNotesRepositorySuccess = (error: { message: string } | null, context: string): void => {
  if (error) throw new LeadNotesRepositoryError(`${context}: ${error.message}`, error)
}

export const assertLeadMessagesRepositorySuccess = (error: { message: string } | null, context: string): void => {
  if (error) throw new LeadMessagesRepositoryError(`${context}: ${error.message}`, error)
}

export const assertLeadTasksRepositorySuccess = (error: { message: string } | null, context: string): void => {
  if (error) throw new LeadTasksRepositoryError(`${context}: ${error.message}`, error)
}
