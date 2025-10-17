import { NextResponse } from "next/server"
import { getDenunciaById, updateDenunciaEstado } from "@/lib/denuncias"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const denuncia = await getDenunciaById(id)

    if (!denuncia) {
      return NextResponse.json({ error: "Denuncia no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ denuncia }, { status: 200 })
  } catch (error) {
    console.error("Get denuncia error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const body = await request.json()
    const { estado } = body

    const validEstados = ["pendiente", "en revisión", "aceptada", "rechazada", "resuelta"]
    if (!estado || !validEstados.includes(estado)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 })
    }

    const denuncia = await getDenunciaById(id)
    if (!denuncia) {
      return NextResponse.json({ error: "Denuncia no encontrada" }, { status: 404 })
    }

    const success = await updateDenunciaEstado(id, estado)

    if (!success) {
      return NextResponse.json({ error: "Error al actualizar el estado" }, { status: 500 })
    }

    return NextResponse.json({ message: "Estado actualizado exitosamente" }, { status: 200 })
  } catch (error) {
    console.error("Update denuncia error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
