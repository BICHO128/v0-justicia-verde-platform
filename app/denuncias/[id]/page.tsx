"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { SeguimientosSection } from "@/components/seguimientos-section"
import { MapPin, Calendar, User, Loader2, ArrowLeft } from "lucide-react"
import type { Denuncia } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"

export default function DenunciaDetailPage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute>
      <DenunciaDetailContent id={params.id} />
    </ProtectedRoute>
  )
}

function DenunciaDetailContent({ id }: { id: string }) {
  const router = useRouter()
  const { isAdmin } = useAuth()
  const [denuncia, setDenuncia] = useState<Denuncia | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    fetchDenuncia()
  }, [id])

  const fetchDenuncia = async () => {
    try {
      const response = await fetch(`/api/denuncias/${id}`)
      const data = await response.json()
      setDenuncia(data.denuncia)
    } catch (error) {
      console.error("[v0] Error fetching denuncia:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEstadoChange = async (newEstado: string) => {
    if (!isAdmin || !denuncia) return

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/denuncias/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: newEstado }),
      })

      if (response.ok) {
        setDenuncia({ ...denuncia, estado: newEstado as any })
      }
    } catch (error) {
      console.error("[v0] Error updating estado:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "outline"
      case "en revisión":
        return "secondary"
      case "aceptada":
        return "default"
      case "rechazada":
        return "destructive"
      case "resuelta":
        return "default"
      default:
        return "outline"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!denuncia) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Denuncia no encontrada</p>
              <Button className="mt-4" onClick={() => router.push("/denuncias")}>
                Volver a Denuncias
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.push("/denuncias")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Denuncias
        </Button>

        <div className="space-y-6">
          {/* Main Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{denuncia.titulo}</CardTitle>
                  <CardDescription>ID: {denuncia.id_denuncia}</CardDescription>
                </div>
                <Badge variant={getEstadoBadgeVariant(denuncia.estado)} className="text-sm">
                  {denuncia.estado}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Admin Status Update */}
              {isAdmin && (
                <div className="p-4 bg-accent rounded-lg space-y-2">
                  <label className="text-sm font-medium">Actualizar Estado (Admin)</label>
                  <Select value={denuncia.estado} onValueChange={handleEstadoChange} disabled={isUpdating}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="en revisión">En Revisión</SelectItem>
                      <SelectItem value="aceptada">Aceptada</SelectItem>
                      <SelectItem value="rechazada">Rechazada</SelectItem>
                      <SelectItem value="resuelta">Resuelta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Descripción</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{denuncia.descripcion}</p>
              </div>

              {/* Metadata */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Fecha:</span>
                  <span className="font-medium">{new Date(denuncia.fecha_creacion).toLocaleDateString("es-CO")}</span>
                </div>

                {denuncia.ubicacion && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Ubicación:</span>
                    <span className="font-medium">{denuncia.ubicacion}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Tipo:</span>
                  <Badge variant="outline">{denuncia.tipo_denuncia}</Badge>
                </div>

                {denuncia.usuario && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Reportado por:</span>
                    <span className="font-medium">{denuncia.usuario.nombre_completo}</span>
                  </div>
                )}
              </div>

              {/* Categories */}
              {denuncia.categorias && denuncia.categorias.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Categorías</h3>
                  <div className="flex flex-wrap gap-2">
                    {denuncia.categorias.map((cat) => (
                      <Badge key={cat.id_categoria} variant="secondary">
                        {cat.nombre_categoria}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <SeguimientosSection denunciaId={Number.parseInt(id)} />
        </div>
      </div>
    </div>
  )
}

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return <label className={className}>{children}</label>
}
