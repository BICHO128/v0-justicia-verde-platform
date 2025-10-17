import { NextResponse } from "next/server"
import { getDenunciaById, updateDenunciaEstado } from "@/lib/denuncias"
import { getUserById } from "@/lib/auth"
import { sendDenunciaStatusNotification } from "@/lib/email"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const denuncia = await getDenunciaById(id)

    if (!denuncia) {
      return NextResponse.json({ error: "Denuncia no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ denuncia }, { status: 200 })
  } catch (error) {
    console.error("[v0] Get denuncia error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()
    const { estado } = body

    // Validate estado
    const validEstados = ["pendiente", "en revisión", "aceptada", "rechazada", "resuelta"]
    if (!estado || !validEstados.includes(estado)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 })
    }

    // Get denuncia details before update
    const denuncia = await getDenunciaById(id)
    if (!denuncia) {
      return NextResponse.json({ error: "Denuncia no encontrada" }, { status: 404 })
    }

    // Update status
    const success = await updateDenunciaEstado(id, estado)

    if (!success) {
      return NextResponse.json({ error: "Error al actualizar el estado" }, { status: 500 })
    }

    // Send email notification if user exists and status changed
    if (denuncia.usuario && denuncia.estado !== estado) {
      const user = await getUserById(denuncia.usuario.id_usuario)
      if (user && user.correo) {
        // Send notification asynchronously (don't wait for it)
        sendDenunciaStatusNotification(user.correo, user.nombre_completo, id, denuncia.titulo, estado).catch((err) =>
          console.error("[v0] Failed to send email notification:", err),
        )
      }
    }

    return NextResponse.json({ message: "Estado actualizado exitosamente" }, { status: 200 })
  } catch (error) {
    console.error("[v0] Update denuncia error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
