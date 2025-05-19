export type LocationType = 'physical' | 'virtual' | 'hybrid' | 'tbd'

export type Parent = {
  locationType?: LocationType
  platform?: string
  frequency?: string
  endType?: string
  isRecurring?: boolean
}

export type Document = {
  locationType?: LocationType
  isRecurring?: boolean
  requiresRegistration?: boolean
}
