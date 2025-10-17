import { NextResponse } from "next/server"
import { addSeguimiento, getSeguimientos } from "@/lib/denuncias"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const denunciaId = searchParams.get("denunciaId")

    if (!denunciaId) {
      return NextResponse.json({ error: "ID de denuncia requerido" }, { status: 400 })
    }

    const seguimientos = await getSeguimientos(Number.parseInt(denunciaId))
    return NextResponse.json({ seguimientos }, { status: 200 })
  } catch (error) {
    console.error("[v0] Get seguimientos error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id_denuncia, id_usuario, comentario } = body

    // Validate required fields
    if (!id_denuncia || !id_usuario || !comentario) {
      return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 })
    }

    const success = await addSeguimiento(id_denuncia, id_usuario, comentario)

    if (!success) {
      return NextResponse.json({ error: "Error al agregar seguimiento" }, { status: 500 })
    }

    return NextResponse.json({ message: "Seguimiento agregado exitosamente" }, { status: 201 })
  } catch (error) {
    console.error("[v0] Add seguimiento error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
