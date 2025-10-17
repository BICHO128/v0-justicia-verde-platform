import { NextResponse } from "next/server"
import { getCategorias } from "@/lib/denuncias"

export async function GET() {
  try {
    const categorias = await getCategorias()
    return NextResponse.json({ categorias }, { status: 200 })
  } catch (error) {
    console.error("Get categories error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
