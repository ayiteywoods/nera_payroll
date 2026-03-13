'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { authService } from '@/lib/auth/auth-service'
import type { AuthContextType, UserProfile, SignInData, SignUpData } from '@/types/auth.types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const signIn = async (data: SignInData) => {
    try {
      setLoading(true)
      const result = await authService.signIn(data)
      if (result.error) {
        return { error: result.error }
      }
      router.push('/dashboard')
      return { error: null }
    } catch (error: any) {
      return { error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (data: SignUpData) => {
    try {
      setLoading(true)
      const result = await authService.signUp(data)
      if (result.error) {
        return { error: result.error }
      }
      router.push('/auth/verify-email')
      return { error: null }
    } catch (error: any) {
      return { error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const result = await authService.signOut()
      if (result.error) {
        return { error: result.error }
      }
      setUser(null)
      setProfile(null)
      router.push('/auth/signin')
      return { error: null }
    } catch (error: any) {
      return { error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) return { error: 'No user logged in' }
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
      if (error) throw error
      await fetchProfile(user.id)
      return { error: null }
    } catch (error: any) {
      return { error: error.message }
    }
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}