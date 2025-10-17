import { NextResponse } from "next/server"
import { createUser, getUserByEmail } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, correo, contrasena, telefono, tipo_usuario } = body

    if (!nombre || !correo || !contrasena) {
      return NextResponse.json({ error: "Todos los campos requeridos deben ser completados" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(correo)) {
      return NextResponse.json({ error: "Formato de correo electrónico inválido" }, { status: 400 })
    }

    if (contrasena.length < 6) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 })
    }

    const existingUser = await getUserByEmail(correo)
    if (existingUser) {
      return NextResponse.json({ error: "El correo electrónico ya está registrado" }, { status: 409 })
    }

    const newUser = await createUser(nombre, correo, contrasena, telefono, tipo_usuario || "ciudadano")

    if (!newUser) {
      return NextResponse.json({ error: "Error al crear el usuario" }, { status: 500 })
    }

    return NextResponse.json(
      {
        message: "Usuario registrado exitosamente",
        user: newUser,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
