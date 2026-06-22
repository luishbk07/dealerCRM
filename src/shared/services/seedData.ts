import type { Lead, Sale, Vehicle } from '@/shared/types'

const now = new Date()

const daysAgo = (days: number): string => {
  const date = new Date(now)
  date.setDate(date.getDate() - days)
  return date.toISOString()
}

const hoursAgo = (hours: number): string => {
  const date = new Date(now)
  date.setHours(date.getHours() - hours)
  return date.toISOString()
}

export const seedVehicles: Vehicle[] = [
  {
    id: 'veh_001',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2021,
    price: 925000,
    mileage: 38000,
    transmission: 'automatic',
    fuelType: 'gasoline',
    images: [
      'https://images.unsplash.com/photo-1623869675781-80aa31012c78?w=1200',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200'
    ],
    description: 'Toyota Corolla 2021 en excelente estado. Único dueño, todos los servicios al día.',
    status: 'available',
    createdAt: daysAgo(20),
    updatedAt: daysAgo(2)
  },
  {
    id: 'veh_002',
    brand: 'Honda',
    model: 'Civic',
    year: 2020,
    price: 875000,
    mileage: 52000,
    transmission: 'automatic',
    fuelType: 'gasoline',
    images: [
      'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=1200'
    ],
    description: 'Honda Civic 2020 EX, full equipo. Aros originales, asientos de cuero.',
    status: 'available',
    createdAt: daysAgo(15),
    updatedAt: daysAgo(1)
  },
  {
    id: 'veh_003',
    brand: 'Hyundai',
    model: 'Tucson',
    year: 2022,
    price: 1450000,
    mileage: 24000,
    transmission: 'automatic',
    fuelType: 'gasoline',
    images: [
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200'
    ],
    description: 'Hyundai Tucson 2022 4x4, prácticamente nueva. Garantía vigente.',
    status: 'reserved',
    createdAt: daysAgo(10),
    updatedAt: daysAgo(3)
  },
  {
    id: 'veh_004',
    brand: 'Kia',
    model: 'Sportage',
    year: 2019,
    price: 1050000,
    mileage: 68000,
    transmission: 'automatic',
    fuelType: 'gasoline',
    images: [
      'https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=1200'
    ],
    description: 'Kia Sportage 2019 LX, mantenimiento completo, motor impecable.',
    status: 'available',
    createdAt: daysAgo(40),
    updatedAt: daysAgo(7)
  },
  {
    id: 'veh_005',
    brand: 'Tesla',
    model: 'Model 3',
    year: 2023,
    price: 2750000,
    mileage: 12000,
    transmission: 'automatic',
    fuelType: 'electric',
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200'
    ],
    description: 'Tesla Model 3 Long Range. Autopilot incluido, prácticamente nuevo.',
    status: 'available',
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1)
  },
  {
    id: 'veh_006',
    brand: 'Ford',
    model: 'Escape',
    year: 2018,
    price: 720000,
    mileage: 95000,
    transmission: 'automatic',
    fuelType: 'gasoline',
    images: [
      'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=1200'
    ],
    description: 'Ford Escape 2018, ideal para familia. Recién servicada.',
    status: 'sold',
    createdAt: daysAgo(60),
    updatedAt: daysAgo(8)
  }
]

export const seedLeads: Lead[] = [
  {
    id: 'lead_001',
    fullName: 'Carlos Martínez',
    phone: '+18095551234',
    email: 'carlos.martinez@example.com',
    vehicleId: 'veh_001',
    status: 'new',
    channel: 'whatsapp',
    notes: [],
    messages: [
      {
        id: 'msg_001',
        author: 'lead',
        content: 'Hola, sigo interesado en el Corolla. ¿Está disponible?',
        createdAt: hoursAgo(1)
      }
    ],
    createdAt: hoursAgo(1),
    updatedAt: hoursAgo(1)
  },
  {
    id: 'lead_002',
    fullName: 'María Fernández',
    phone: '+18095559876',
    email: 'maria.fernandez@example.com',
    vehicleId: 'veh_002',
    status: 'contacted',
    channel: 'website',
    notes: [
      {
        id: 'note_001',
        content: 'Pidió ver el Civic el sábado en la mañana.',
        createdAt: hoursAgo(20)
      }
    ],
    messages: [
      {
        id: 'msg_002',
        author: 'lead',
        content: 'Quisiera agendar una prueba de manejo.',
        createdAt: daysAgo(1)
      },
      {
        id: 'msg_003',
        author: 'dealer',
        content: '¡Claro! ¿Le viene bien el sábado a las 10:00 AM?',
        createdAt: hoursAgo(20)
      }
    ],
    createdAt: daysAgo(1),
    updatedAt: hoursAgo(20)
  },
  {
    id: 'lead_003',
    fullName: 'José Reyes',
    phone: '+18094441122',
    vehicleId: 'veh_003',
    status: 'negotiating',
    channel: 'facebook',
    notes: [
      {
        id: 'note_002',
        content: 'Ofreció RD$1,400,000 al contado.',
        createdAt: daysAgo(2)
      }
    ],
    messages: [
      {
        id: 'msg_004',
        author: 'lead',
        content: '¿Aceptan RD$1,400,000 al contado?',
        createdAt: daysAgo(2)
      }
    ],
    createdAt: daysAgo(4),
    updatedAt: daysAgo(2)
  },
  {
    id: 'lead_004',
    fullName: 'Ana Polanco',
    phone: '+18092223344',
    email: 'ana.polanco@example.com',
    vehicleId: 'veh_004',
    status: 'new',
    channel: 'instagram',
    notes: [],
    messages: [
      {
        id: 'msg_005',
        author: 'lead',
        content: 'Vi el Sportage en Instagram, ¿cuánto es el inicial?',
        createdAt: hoursAgo(5)
      }
    ],
    createdAt: hoursAgo(5),
    updatedAt: hoursAgo(5)
  },
  {
    id: 'lead_005',
    fullName: 'Luis Báez',
    phone: '+18097778899',
    vehicleId: 'veh_006',
    status: 'sold',
    channel: 'whatsapp',
    notes: [
      {
        id: 'note_003',
        content: 'Cerrado a RD$715,000. Cliente muy satisfecho.',
        createdAt: daysAgo(9)
      }
    ],
    messages: [],
    createdAt: daysAgo(20),
    updatedAt: daysAgo(9)
  },
  {
    id: 'lead_006',
    fullName: 'Patricia Núñez',
    phone: '+18093334455',
    vehicleId: 'veh_005',
    status: 'lost',
    channel: 'website',
    notes: [
      {
        id: 'note_004',
        content: 'Decidió comprar otra marca. Mantener contacto.',
        createdAt: daysAgo(6)
      }
    ],
    messages: [],
    createdAt: daysAgo(12),
    updatedAt: daysAgo(6)
  }
]

export const seedSales: Sale[] = [
  {
    id: 'sale_001',
    vehicleId: 'veh_006',
    leadId: 'lead_005',
    buyerName: 'Luis Báez',
    finalPrice: 715000,
    soldAt: daysAgo(9)
  },
  {
    id: 'sale_002',
    vehicleId: 'veh_001',
    buyerName: 'Roberto Suárez',
    finalPrice: 920000,
    soldAt: daysAgo(45)
  },
  {
    id: 'sale_003',
    vehicleId: 'veh_002',
    buyerName: 'Elena Castillo',
    finalPrice: 860000,
    soldAt: daysAgo(70)
  }
]
