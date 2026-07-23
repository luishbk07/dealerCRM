export { adGeneratorService } from './adGeneratorService'
export type { AdGeneratorService, GeneratedAd } from './adGeneratorService'

export { saleService, getSaleUserMessage } from './saleService'
export type {
  CreateSaleInput,
  SaleSummary,
  ConvertLeadToSaleResult,
  SaleListParams,
  SaleListResult
} from './saleService'

export { leadService } from './leadService'
export type {
  CreateLeadFromPublicInput,
  CreateLeadFromDashboardInput,
  LeadWithRelations,
  CreateLeadInput,
  CreateLeadMessageInput,
  CreateLeadNoteInput,
  Lead,
  LeadListResult,
  LeadMessage,
  LeadNote,
  LeadSearchParams,
  LeadStatus,
  UpdateLeadInput,
  LeadListParams
} from './leadService'

export { supabase, isSupabaseConfigured } from './supabase'
