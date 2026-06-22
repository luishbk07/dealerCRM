export type LeadStatus = 'new' | 'contacted' | 'negotiating' | 'sold' | 'lost'

export type LeadChannel = 'whatsapp' | 'website' | 'facebook' | 'instagram' | 'phone'

export interface LeadMessage {
  id: string
  author: 'lead' | 'dealer'
  content: string
  createdAt: string
}

export interface LeadNote {
  id: string
  content: string
  createdAt: string
}

export interface Lead {
  id: string
  fullName: string
  phone: string
  email?: string
  vehicleId: string
  status: LeadStatus
  channel: LeadChannel
  notes: LeadNote[]
  messages: LeadMessage[]
  createdAt: string
  updatedAt: string
}

export type LeadInput = Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'notes' | 'messages'>
