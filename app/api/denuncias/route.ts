import { NextResponse } from "next/server"
import { createDenuncia, getDenuncias } from "@/lib/denuncias"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const estado = searchParams.get("estado")

    const denuncias = await getDenuncias(userId ? Number.parseInt(userId) : undefined, estado || undefined)

    return NextResponse.json({ denuncias }, { status: 200 })
  } catch (error) {
    console.error("[v0] Get denuncias error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { titulo, descripcion, ubicacion, tipo_denuncia, id_usuario, categoria_ids } = body

    // Validate required fields
    if (!titulo || !descripcion || !tipo_denuncia) {
      return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 })
    }

    // Validate tipo_denuncia
    if (tipo_denuncia !== "oficial" && tipo_denuncia !== "anonima") {
      return NextResponse.json({ error: "Tipo de denuncia inválido" }, { status: 400 })
    }

    // For official denuncias, user ID is required
    if (tipo_denuncia === "oficial" && !id_usuario) {
      return NextResponse.json({ error: "Usuario requerido para denuncias oficiales" }, { status: 400 })
    }

    const denunciaId = await createDenuncia(
      titulo,
      descripcion,
      ubicacion || "",
      tipo_denuncia,
      tipo_denuncia === "oficial" ? id_usuario : null,
      categoria_ids || [],
    )

    if (!denunciaId) {
      return NextResponse.json({ error: "Error al crear la denuncia" }, { status: 500 })
    }

    return NextResponse.json(
      {
        message: "Denuncia creada exitosamente",
        id_denuncia: denunciaId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Create denuncia error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
