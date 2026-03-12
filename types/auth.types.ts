export interface SignUpData {
  email: string
  password: string
  fullName: string
  role?: 'admin' | 'hr_manager' | 'finance_manager' | 'employee'
}

export interface SignInData {
  email: string
  password: string
}

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: 'admin' | 'hr_manager' | 'finance_manager' | 'employee'
  department: string | null
  position: string | null
  employee_id: string | null
  phone: string | null
  date_of_birth: string | null
  hire_date: string | null
  status: 'active' | 'inactive' | 'on_leave' | 'terminated'
  created_at: string
  updated_at: string
}

export interface AuthContextType {
  user: any | null
  profile: UserProfile | null
  loading: boolean
  signIn: (data: SignInData) => Promise<{ error: string | null }>
  signUp: (data: SignUpData) => Promise<{ error: string | null }>
  signOut: () => Promise<{ error: string | null }>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: string | null }>
}