export class SalesRepositoryError extends Error {
  readonly code = 'SALES_REPOSITORY_ERROR'

  constructor(message: string, public readonly cause?: unknown) {
    super(message)
    this.name = 'SalesRepositoryError'
  }
}

export class SaleValidationError extends Error {
  readonly code = 'SALE_VALIDATION_ERROR'

  constructor(public readonly userMessage: string) {
    super(userMessage)
    this.name = 'SaleValidationError'
  }
}

export class SaleServiceError extends Error {
  readonly code = 'SALE_SERVICE_ERROR'

  constructor(
    message: string,
    public readonly userMessage: string,
    public readonly cause?: unknown
  ) {
    super(message)
    this.name = 'SaleServiceError'
  }
}

export const assertSalesRepositorySuccess = (error: { message: string } | null, context: string): void => {
  if (error) throw new SalesRepositoryError(`${context}: ${error.message}`, error)
}

export const getSaleUserMessage = (error: unknown): string => {
  if (error instanceof SaleValidationError) return error.userMessage
  if (error instanceof SaleServiceError) return error.userMessage
  return 'No fue posible registrar la venta.'
}
