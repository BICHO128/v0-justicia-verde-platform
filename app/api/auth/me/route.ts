import { NextResponse } from "next/server"
import { getUserById } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    // Get user ID from query params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("id")

    if (!userId) {
      return NextResponse.json({ error: "ID de usuario requerido" }, { status: 400 })
    }

    const user = await getUserById(Number.parseInt(userId))

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error("[v0] Get user error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
