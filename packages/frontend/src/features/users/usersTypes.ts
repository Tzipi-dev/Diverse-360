export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  role: 'student' | 'manager'
  group?: string
  createdAt: Date
}