export interface User {
   id: string
  firstName: string
  lastName: string
  email: string
  password: string       
  phone?: string
  role: 'student'|'manager',
  createdAt: Date
}

export let users: User[] = [
]