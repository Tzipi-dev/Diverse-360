export interface SignUpFormValues {
  firstName: string;
  lastName: string;
  // id: string;
  email: string;
  password: string;
  phone: string;
  // role: 'student' ;
  // group?: string;
}

export interface LogInValues{
  userName:string;
  password:string;
}

export interface User {
  
  id: string;
  firstName: string;
  lastName: string;
  password: string;     
  email: string;
  phone?: string;
  role: 'student' | 'manager';
  createdAt: Date;
  displayName?: string;
}
// authTypes.ts

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
}
