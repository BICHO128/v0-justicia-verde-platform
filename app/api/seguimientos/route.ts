import { NextResponse } from "next/server"
import { addSeguimiento, getSeguimientos } from "@/lib/denuncias"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const denunciaId = searchParams.get("denunciaId")

    if (!denunciaId) {
      return NextResponse.json({ error: "ID de denuncia requerido" }, { status: 400 })
    }

    const id = Number.parseInt(denunciaId)
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID de denuncia inválido" }, { status: 400 })
    }

    const seguimientos = await getSeguimientos(id)
    return NextResponse.json({ seguimientos }, { status: 200 })
  } catch (error) {
    console.error("Get seguimientos error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id_denuncia, id_usuario, comentario } = body

    if (!id_denuncia || !id_usuario || !comentario) {
      return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 })
    }

    if (comentario.trim().length === 0) {
      return NextResponse.json({ error: "El comentario no puede estar vacío" }, { status: 400 })
    }

    const success = await addSeguimiento(id_denuncia, id_usuario, comentario)

    if (!success) {
      return NextResponse.json({ error: "Error al agregar seguimiento" }, { status: 500 })
    }

    return NextResponse.json({ message: "Seguimiento agregado exitosamente" }, { status: 201 })
  } catch (error) {
    console.error("Add seguimiento error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
