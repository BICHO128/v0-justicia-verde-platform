import { NextResponse } from "next/server"
import { getDashboardStats } from "@/lib/denuncias"

export async function GET() {
  try {
    const stats = await getDashboardStats()
    return NextResponse.json({ stats }, { status: 200 })
  } catch (error) {
    console.error("Get stats error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
