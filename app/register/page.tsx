"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Leaf, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    contrasena: "",
    confirmarContrasena: "",
    tipo_usuario: "ciudadano" as "ciudadano" | "administrador",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate passwords match
    if (formData.contrasena !== formData.confirmarContrasena) {
      setError("Las contraseñas no coinciden")
      return
    }

    // Validate password length
    if (formData.contrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          correo: formData.correo,
          telefono: formData.telefono,
          contrasena: formData.contrasena,
          tipo_usuario: formData.tipo_usuario,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Error al registrar usuario")
        setIsLoading(false)
        return
      }

      // Auto-login after successful registration
      login(data.user)

      // Redirect based on user type
      if (data.user.tipo_usuario === "administrador") {
        router.push("/admin")
      } else {
        router.push("/denuncias")
      }
    } catch (err) {
      setError("Error de conexión. Por favor, intenta de nuevo.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent-light to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Leaf className="h-10 w-10 text-primary" />
          <span className="text-3xl font-bold text-primary">Justicia Verde</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
            <CardDescription>Regístrate para comenzar a hacer denuncias ambientales</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Juan Pérez"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="correo">Correo Electrónico</Label>
                <Input
                  id="correo"
                  type="email"
                  placeholder="tu@correo.com"
                  value={formData.correo}
                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono (Opcional)</Label>
                <Input
                  id="telefono"
                  type="tel"
                  placeholder="+57 300 123 4567"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo_usuario">Tipo de Usuario</Label>
                <Select
                  value={formData.tipo_usuario}
                  onValueChange={(value: "ciudadano" | "administrador") =>
                    setFormData({ ...formData, tipo_usuario: value })
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger id="tipo_usuario">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ciudadano">Ciudadano</SelectItem>
                    <SelectItem value="administrador">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contrasena">Contraseña</Label>
                <Input
                  id="contrasena"
                  type="password"
                  placeholder="••••••••"
                  value={formData.contrasena}
                  onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmarContrasena">Confirmar Contraseña</Label>
                <Input
                  id="confirmarContrasena"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmarContrasena}
                  onChange={(e) => setFormData({ ...formData, confirmarContrasena: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  "Crear Cuenta"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground text-center">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Inicia sesión aquí
              </Link>
            </p>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground text-center">
              Volver al inicio
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
