export interface Tag {
  id: string
  name: string
  color: string
  isDefault: boolean
}

export interface TagCreatePayload {
  name: string
  color: string
}
