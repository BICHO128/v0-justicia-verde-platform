"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Usuario } from "@/lib/types"

interface AuthContextType {
  user: Usuario | null
  login: (user: Usuario) => void
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("justicia_verde_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("[v0] Error parsing stored user:", error)
        localStorage.removeItem("justicia_verde_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = (userData: Usuario) => {
    setUser(userData)
    localStorage.setItem("justicia_verde_user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("justicia_verde_user")
  }

  const isAuthenticated = user !== null
  const isAdmin = user?.tipo_usuario === "administrador"

  if (isLoading) {
    return null // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
