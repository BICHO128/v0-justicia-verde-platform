import { NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { correo, contrasena } = body

    if (!correo || !contrasena) {
      return NextResponse.json({ error: "Correo y contraseña son requeridos" }, { status: 400 })
    }

    const user = await authenticateUser(correo, contrasena)

    if (!user) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    return NextResponse.json(
      {
        message: "Inicio de sesión exitoso",
        user,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
