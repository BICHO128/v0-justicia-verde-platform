"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { Plus, MapPin, Calendar, Loader2, Bell } from "lucide-react"
import type { Denuncia } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"

export default function DenunciasPage() {
  return (
    <ProtectedRoute>
      <DenunciasContent />
    </ProtectedRoute>
  )
}

function DenunciasContent() {
  const { user, isAdmin } = useAuth()
  const [denuncias, setDenuncias] = useState<Denuncia[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [estadoFilter, setEstadoFilter] = useState<string>("all")

  useEffect(() => {
    fetchDenuncias()
  }, [user, isAdmin])

  const fetchDenuncias = async () => {
    try {
      // Admin sees all denuncias, users see only their own
      const url = isAdmin ? "/api/denuncias" : `/api/denuncias?userId=${user?.id_usuario}`
      const response = await fetch(url)
      const data = await response.json()
      setDenuncias(data.denuncias || [])
    } catch (error) {
      console.error("[v0] Error fetching denuncias:", error)
    } finally {
      setIsLoading(false)
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

  const hasUpdates = (denuncia: Denuncia) => {
    return denuncia.estado !== "pendiente" && denuncia.estado !== "resuelta"
  }

  const filteredDenuncias = estadoFilter === "all" ? denuncias : denuncias.filter((d) => d.estado === estadoFilter)

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{isAdmin ? "Todas las Denuncias" : "Mis Denuncias"}</h1>
            <p className="text-muted-foreground mt-2">
              {isAdmin
                ? "Gestiona y revisa todas las denuncias ambientales"
                : "Visualiza y gestiona tus denuncias ambientales"}
            </p>
          </div>
          <Link href="/denuncias/nueva">
            <Button size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Nueva Denuncia
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center gap-4">
          <span className="text-sm font-medium">Filtrar por estado:</span>
          <Select value={estadoFilter} onValueChange={setEstadoFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="en revisión">En Revisión</SelectItem>
              <SelectItem value="aceptada">Aceptada</SelectItem>
              <SelectItem value="rechazada">Rechazada</SelectItem>
              <SelectItem value="resuelta">Resuelta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Denuncias List */}
        {filteredDenuncias.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No hay denuncias para mostrar</p>
              <Link href="/denuncias/nueva">
                <Button className="mt-4">Crear Primera Denuncia</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDenuncias.map((denuncia) => (
              <Card key={denuncia.id_denuncia} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2 flex items-center gap-2">
                      {denuncia.titulo}
                      {!isAdmin && hasUpdates(denuncia) && <Bell className="h-4 w-4 text-primary flex-shrink-0" />}
                    </CardTitle>
                    <Badge variant={getEstadoBadgeVariant(denuncia.estado)}>{denuncia.estado}</Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{denuncia.descripcion}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {denuncia.ubicacion && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{denuncia.ubicacion}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(denuncia.fecha_creacion).toLocaleDateString("es-CO")}</span>
                  </div>
                  {denuncia.categorias && denuncia.categorias.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {denuncia.categorias.map((cat) => (
                        <Badge key={cat.id_categoria} variant="secondary">
                          {cat.nombre_categoria}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="pt-2">
                    <Link href={`/denuncias/${denuncia.id_denuncia}`}>
                      <Button variant="outline" className="w-full bg-transparent">
                        Ver Detalles
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
