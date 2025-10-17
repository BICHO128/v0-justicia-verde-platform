"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Navbar } from "@/components/navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import type { Categoria } from "@/lib/types"

export default function NuevaDenunciaPage() {
  return (
    <ProtectedRoute>
      <NuevaDenunciaContent />
    </ProtectedRoute>
  )
}

function NuevaDenunciaContent() {
  const router = useRouter()
  const { user } = useAuth()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    ubicacion: "",
    tipo_denuncia: "oficial" as "oficial" | "anonima",
    categoria_ids: [] as number[],
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchCategorias()
  }, [])

  const fetchCategorias = async () => {
    try {
      const response = await fetch("/api/categorias")
      const data = await response.json()
      setCategorias(data.categorias || [])
    } catch (error) {
      console.error("[v0] Error fetching categories:", error)
    }
  }

  const handleCategoryToggle = (categoryId: number) => {
    setFormData((prev) => ({
      ...prev,
      categoria_ids: prev.categoria_ids.includes(categoryId)
        ? prev.categoria_ids.filter((id) => id !== categoryId)
        : [...prev.categoria_ids, categoryId],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate required fields
    if (!formData.titulo || !formData.descripcion) {
      setError("Título y descripción son requeridos")
      return
    }

    if (formData.categoria_ids.length === 0) {
      setError("Selecciona al menos una categoría")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/denuncias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          id_usuario: formData.tipo_denuncia === "oficial" ? user?.id_usuario : null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Error al crear la denuncia")
        setIsLoading(false)
        return
      }

      // Redirect to denuncias list
      router.push("/denuncias")
    } catch (err) {
      setError("Error de conexión. Por favor, intenta de nuevo.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Nueva Denuncia Ambiental</CardTitle>
            <CardDescription>
              Completa el formulario para reportar un delito ambiental. Tu denuncia será revisada por nuestro equipo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Tipo de Denuncia */}
              <div className="space-y-3">
                <Label>Tipo de Denuncia</Label>
                <RadioGroup
                  value={formData.tipo_denuncia}
                  onValueChange={(value: "oficial" | "anonima") => setFormData({ ...formData, tipo_denuncia: value })}
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="oficial" id="oficial" />
                    <Label htmlFor="oficial" className="font-normal cursor-pointer">
                      Oficial (con mi nombre)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="anonima" id="anonima" />
                    <Label htmlFor="anonima" className="font-normal cursor-pointer">
                      Anónima (sin identificación)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="titulo">Título de la Denuncia *</Label>
                <Input
                  id="titulo"
                  type="text"
                  placeholder="Ej: Tala ilegal en zona protegida"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción Detallada *</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Describe el delito ambiental con el mayor detalle posible..."
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  required
                  disabled={isLoading}
                  rows={6}
                />
              </div>

              {/* Ubicación */}
              <div className="space-y-2">
                <Label htmlFor="ubicacion">Ubicación</Label>
                <Input
                  id="ubicacion"
                  type="text"
                  placeholder="Ej: Amazonas, Colombia"
                  value={formData.ubicacion}
                  onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              {/* Categorías */}
              <div className="space-y-3">
                <Label>Categorías * (selecciona al menos una)</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {categorias.map((categoria) => (
                    <div key={categoria.id_categoria} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${categoria.id_categoria}`}
                        checked={formData.categoria_ids.includes(categoria.id_categoria)}
                        onCheckedChange={() => handleCategoryToggle(categoria.id_categoria)}
                        disabled={isLoading}
                      />
                      <Label htmlFor={`cat-${categoria.id_categoria}`} className="font-normal cursor-pointer text-sm">
                        {categoria.nombre_categoria}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando denuncia...
                    </>
                  ) : (
                    "Crear Denuncia"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/denuncias")} disabled={isLoading}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
