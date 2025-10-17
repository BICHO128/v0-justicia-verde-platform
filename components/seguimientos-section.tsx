"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, MessageSquare, User, Calendar } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface Seguimiento {
  id_seguimiento: number
  id_denuncia: number
  id_usuario: number
  comentario: string
  fecha: Date
  nombre_completo: string
  tipo_usuario: string
}

export function SeguimientosSection({ denunciaId }: { denunciaId: number }) {
  const { user, isAdmin } = useAuth()
  const [seguimientos, setSeguimientos] = useState<Seguimiento[]>([])
  const [comentario, setComentario] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchSeguimientos()
  }, [denunciaId])

  const fetchSeguimientos = async () => {
    try {
      const response = await fetch(`/api/seguimientos?denunciaId=${denunciaId}`)
      const data = await response.json()
      setSeguimientos(data.seguimientos || [])
    } catch (error) {
      console.error("[v0] Error fetching seguimientos:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!comentario.trim()) {
      setError("El comentario no puede estar vacío")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/seguimientos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_denuncia: denunciaId,
          id_usuario: user?.id_usuario,
          comentario: comentario.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Error al agregar seguimiento")
        setIsSubmitting(false)
        return
      }

      // Refresh seguimientos and clear form
      setComentario("")
      await fetchSeguimientos()
    } catch (err) {
      setError("Error de conexión. Por favor, intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Seguimiento y Comentarios
        </CardTitle>
        <CardDescription>Historial de actualizaciones y comentarios administrativos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Comment Form (Admin Only) */}
        {isAdmin && (
          <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-accent rounded-lg">
            <div className="space-y-2">
              <label className="text-sm font-medium">Agregar Comentario de Seguimiento</label>
              <Textarea
                placeholder="Escribe un comentario sobre el estado o progreso de esta denuncia..."
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                disabled={isSubmitting}
                rows={4}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Agregando...
                </>
              ) : (
                "Agregar Seguimiento"
              )}
            </Button>
          </form>
        )}

        {/* Seguimientos List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : seguimientos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No hay seguimientos registrados aún</p>
          </div>
        ) : (
          <div className="space-y-4">
            {seguimientos.map((seg) => (
              <div key={seg.id_seguimiento} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{seg.nombre_completo}</span>
                    {seg.tipo_usuario === "administrador" && <Badge variant="secondary">Admin</Badge>}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(seg.fecha).toLocaleString("es-CO")}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{seg.comentario}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
