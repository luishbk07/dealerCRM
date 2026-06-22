import type { Lead, LeadInput, LeadMessage, LeadNote, LeadStatus } from '@/shared/types'
import { createId } from '@/shared/utils/id'
import { delay } from '@/shared/utils/delay'
import { storage } from './storage'
import { seedLeads } from './seedData'

export interface LeadService {
  list(): Promise<Lead[]>
  getById(id: string): Promise<Lead | null>
  create(input: LeadInput): Promise<Lead>
  updateStatus(id: string, status: LeadStatus): Promise<Lead>
  addNote(id: string, content: string): Promise<Lead>
  addMessage(id: string, message: Omit<LeadMessage, 'id' | 'createdAt'>): Promise<Lead>
}

const STORAGE_KEY = 'leads'

const loadLeads = (): Lead[] => storage.get<Lead[]>(STORAGE_KEY, seedLeads)

const persist = (leads: Lead[]): void => storage.set(STORAGE_KEY, leads)

const replaceLead = (leads: Lead[], updated: Lead): Lead[] => {
  return leads.map((lead) => (lead.id === updated.id ? updated : lead))
}

export const leadService: LeadService = {
  async list() {
    await delay(120)
    return loadLeads()
  },
  async getById(id) {
    await delay(80)
    return loadLeads().find((lead) => lead.id === id) ?? null
  },
  async create(input) {
    await delay(150)
    const timestamp = new Date().toISOString()
    const lead: Lead = {
      ...input,
      id: createId('lead'),
      notes: [],
      messages: [],
      createdAt: timestamp,
      updatedAt: timestamp
    }
    const next = [lead, ...loadLeads()]
    persist(next)
    return lead
  },
  async updateStatus(id, status) {
    await delay(100)
    const leads = loadLeads()
    const lead = leads.find((entry) => entry.id === id)
    if (!lead) throw new Error(`Lead ${id} not found`)
    const updated: Lead = { ...lead, status, updatedAt: new Date().toISOString() }
    persist(replaceLead(leads, updated))
    return updated
  },
  async addNote(id, content) {
    await delay(100)
    const leads = loadLeads()
    const lead = leads.find((entry) => entry.id === id)
    if (!lead) throw new Error(`Lead ${id} not found`)
    const note: LeadNote = {
      id: createId('note'),
      content,
      createdAt: new Date().toISOString()
    }
    const updated: Lead = {
      ...lead,
      notes: [note, ...lead.notes],
      updatedAt: new Date().toISOString()
    }
    persist(replaceLead(leads, updated))
    return updated
  },
  async addMessage(id, message) {
    await delay(100)
    const leads = loadLeads()
    const lead = leads.find((entry) => entry.id === id)
    if (!lead) throw new Error(`Lead ${id} not found`)
    const newMessage: LeadMessage = {
      ...message,
      id: createId('msg'),
      createdAt: new Date().toISOString()
    }
    const updated: Lead = {
      ...lead,
      messages: [...lead.messages, newMessage],
      updatedAt: new Date().toISOString()
    }
    persist(replaceLead(leads, updated))
    return updated
  }
}
