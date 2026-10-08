'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Определяем роль из Firestore (в реальном приложении)
        // Пока используем email для демо
        let role = 'customer'
        const email = firebaseUser.email || ''
        if (email.includes('founder')) role = 'founder'
        else if (email.includes('admin'))    role = 'admin'
        else if (email.includes('kitchen'))  role = 'kitchen'
        else if (email.includes('courier'))  role = 'courier'

        // Также проверяем список известных админов
        const ADMIN_EMAILS = [
          'admin@imperia.com',
          'admin@imperia-pizza.com',
          'founder@imperia.com',
          'founder@imperia-pizza.com',
        ]
        if (ADMIN_EMAILS.includes(email)) role = 'admin'

        setUser({
          uid:    firebaseUser.uid,
          name:   firebaseUser.displayName || email.split('@')[0] || 'Пользователь',
          email:  email,
          avatar: firebaseUser.photoURL,
          role,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const logout = async () => {
    await signOut(auth)
    setUser(null)
  }

  const isAdmin = user?.role === 'admin' || user?.role === 'founder' || (typeof document !== 'undefined' && document.cookie.includes('adminRole=admin'))

  return (
    <AuthContext.Provider value={{ user, loading, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
