import { NextResponse } from "next/server"
import { addEvidencia, getEvidencias } from "@/lib/denuncias"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const denunciaId = searchParams.get("denunciaId")

    if (!denunciaId) {
      return NextResponse.json({ error: "ID de denuncia requerido" }, { status: 400 })
    }

    const evidencias = await getEvidencias(Number.parseInt(denunciaId))
    return NextResponse.json({ evidencias }, { status: 200 })
  } catch (error) {
    console.error("[v0] Get evidencias error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id_denuncia, tipo, url_archivo } = body

    // Validate required fields
    if (!id_denuncia || !tipo || !url_archivo) {
      return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 })
    }

    // Validate tipo
    const validTipos = ["imagen", "video", "documento"]
    if (!validTipos.includes(tipo)) {
      return NextResponse.json({ error: "Tipo de evidencia inválido" }, { status: 400 })
    }

    const success = await addEvidencia(id_denuncia, tipo, url_archivo)

    if (!success) {
      return NextResponse.json({ error: "Error al agregar evidencia" }, { status: 500 })
    }

    return NextResponse.json({ message: "Evidencia agregada exitosamente" }, { status: 201 })
  } catch (error) {
    console.error("[v0] Add evidencia error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
