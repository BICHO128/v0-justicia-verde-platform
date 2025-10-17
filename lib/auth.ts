import bcrypt from "bcryptjs"
import pool from "./db"
import type { Usuario } from "./types"

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Get user by email (excluding password)
export async function getUserByEmail(email: string): Promise<Usuario | null> {
  try {
    const [rows] = await pool.query(
      "SELECT id_usuario, nombre_completo, correo, telefono, tipo_usuario, fecha_registro FROM usuarios WHERE correo = ?",
      [email],
    )
    const users = rows as Usuario[]
    return users.length > 0 ? users[0] : null
  } catch (error) {
    console.error("[v0] Error fetching user by email:", error)
    return null
  }
}

// Get user by ID (excluding password)
export async function getUserById(id: number): Promise<Usuario | null> {
  try {
    const [rows] = await pool.query(
      "SELECT id_usuario, nombre_completo, correo, telefono, tipo_usuario, fecha_registro FROM usuarios WHERE id_usuario = ?",
      [id],
    )
    const users = rows as Usuario[]
    return users.length > 0 ? users[0] : null
  } catch (error) {
    console.error("[v0] Error fetching user by ID:", error)
    return null
  }
}

// Authenticate user
export async function authenticateUser(email: string, password: string): Promise<Usuario | null> {
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE correo = ?", [email])
    const users = rows as Array<Usuario & { contrasena: string }>

    if (users.length === 0) {
      return null
    }

    const user = users[0]
    const isValid = await verifyPassword(password, user.contrasena)

    if (!isValid) {
      return null
    }

    // Return user without password
    const { contrasena, ...userWithoutPassword } = user
    return userWithoutPassword as Usuario
  } catch (error) {
    console.error("[v0] Error authenticating user:", error)
    return null
  }
}

// Create new user
export async function createUser(
  nombre: string,
  email: string,
  password: string,
  telefono?: string,
  tipoUsuario: "ciudadano" | "administrador" = "ciudadano",
): Promise<Usuario | null> {
  try {
    const hashedPassword = await hashPassword(password)

    const [result] = await pool.query(
      "INSERT INTO usuarios (nombre_completo, correo, contrasena, telefono, tipo_usuario) VALUES (?, ?, ?, ?, ?)",
      [nombre, email, hashedPassword, telefono || null, tipoUsuario],
    )

    const insertResult = result as { insertId: number }
    return getUserById(insertResult.insertId)
  } catch (error) {
    console.error("[v0] Error creating user:", error)
    return null
  }
}
