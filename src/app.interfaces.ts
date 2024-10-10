export enum EInspectionStatus {
  CANCELED = 'Cancelado',
  DONE = 'Concluido',
  PENDING = 'Pendente',
  PROCESSING = 'Em Progresso'
}

export interface IDashboard {
  total: number
  pendencias: number
  ultimaInspecao: string
  inspecoes: {
    jan: number
    fev: number
    mar: number
    abr: number
    mai: number
    jun: number
    jul: number
    ago: number
    set: number
    out: number
    nov: number
    dez: number
  }
}

export interface IInspection {
  created_at: Date
  description: string
  edificio: string
  images: string[]
  inspetor: string
  status: EInspectionStatus
  updated_at: Date
}
