"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { AlertCircle, CheckCircle, Clock, Eye, FileText, Loader2, TrendingUp, Users, XCircle } from "lucide-react"
import type { Denuncia } from "@/lib/types"

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminContent />
    </ProtectedRoute>
  )
}

function AdminContent() {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([])
  const [stats, setStats] = useState({
    total: 0,
    pendiente: 0,
    enRevision: 0,
    aceptada: 0,
    rechazada: 0,
    resuelta: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [denunciasRes, statsRes] = await Promise.all([fetch("/api/denuncias"), fetch("/api/stats")])

      const denunciasData = await denunciasRes.json()
      const statsData = await statsRes.json()

      setDenuncias(denunciasData.denuncias || [])
      setStats(statsData.stats || stats)
    } catch (error) {
      console.error("[v0] Error fetching admin data:", error)
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

  const filterByEstado = (estado: string) => {
    return denuncias.filter((d) => d.estado === estado)
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Panel de Administración</h1>
          <p className="text-muted-foreground mt-2">Gestiona y supervisa todas las denuncias ambientales</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Denuncias</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">Todas las denuncias registradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendiente}</div>
              <p className="text-xs text-muted-foreground mt-1">Requieren revisión inmediata</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">En Revisión</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.enRevision}</div>
              <p className="text-xs text-muted-foreground mt-1">Siendo procesadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Aceptadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.aceptada}</div>
              <p className="text-xs text-muted-foreground mt-1">Casos validados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Resueltas</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resuelta}</div>
              <p className="text-xs text-muted-foreground mt-1">Casos completados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Rechazadas</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rechazada}</div>
              <p className="text-xs text-muted-foreground mt-1">Casos no procedentes</p>
            </CardContent>
          </Card>
        </div>

        {/* Denuncias Management */}
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Denuncias</CardTitle>
            <CardDescription>Revisa y actualiza el estado de las denuncias</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">Todas ({stats.total})</TabsTrigger>
                <TabsTrigger value="pendiente">Pendientes ({stats.pendiente})</TabsTrigger>
                <TabsTrigger value="en revisión">En Revisión ({stats.enRevision})</TabsTrigger>
                <TabsTrigger value="aceptada">Aceptadas ({stats.aceptada})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <DenunciasTable denuncias={denuncias} getEstadoBadgeVariant={getEstadoBadgeVariant} />
              </TabsContent>

              <TabsContent value="pendiente" className="mt-6">
                <DenunciasTable denuncias={filterByEstado("pendiente")} getEstadoBadgeVariant={getEstadoBadgeVariant} />
              </TabsContent>

              <TabsContent value="en revisión" className="mt-6">
                <DenunciasTable
                  denuncias={filterByEstado("en revisión")}
                  getEstadoBadgeVariant={getEstadoBadgeVariant}
                />
              </TabsContent>

              <TabsContent value="aceptada" className="mt-6">
                <DenunciasTable denuncias={filterByEstado("aceptada")} getEstadoBadgeVariant={getEstadoBadgeVariant} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DenunciasTable({
  denuncias,
  getEstadoBadgeVariant,
}: {
  denuncias: Denuncia[]
  getEstadoBadgeVariant: (estado: string) => any
}) {
  if (denuncias.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No hay denuncias en esta categoría</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {denuncias.map((denuncia) => (
            <TableRow key={denuncia.id_denuncia}>
              <TableCell className="font-medium">#{denuncia.id_denuncia}</TableCell>
              <TableCell className="max-w-[300px]">
                <div className="line-clamp-2">{denuncia.titulo}</div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{denuncia.tipo_denuncia}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getEstadoBadgeVariant(denuncia.estado)}>{denuncia.estado}</Badge>
              </TableCell>
              <TableCell>{new Date(denuncia.fecha_creacion).toLocaleDateString("es-CO")}</TableCell>
              <TableCell>
                {denuncia.usuario ? (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{denuncia.usuario.nombre_completo}</span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Anónimo</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/denuncias/${denuncia.id_denuncia}`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
