import { getPool, executeQuery } from "./db"
import type { Denuncia, Categoria, Evidencia } from "./types"

const pool = getPool()

// Get all categories
export async function getCategorias(): Promise<Categoria[]> {
  try {
    const [rows] = await executeQuery("SELECT * FROM categorias ORDER BY nombre_categoria")
    return rows as Categoria[]
  } catch (error) {
    console.error("[v0] Error fetching categories:", error)
    return []
  }
}

// Create a new denuncia
export async function createDenuncia(
  titulo: string,
  descripcion: string,
  ubicacion: string,
  tipoDenuncia: "oficial" | "anonima",
  idUsuario: number | null,
  categoriaIds: number[],
): Promise<number | null> {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()

    // Insert denuncia
    const [result] = await connection.query(
      "INSERT INTO denuncias (id_usuario, tipo_denuncia, titulo, descripcion, ubicacion, estado) VALUES (?, ?, ?, ?, ?, 'pendiente')",
      [idUsuario, tipoDenuncia, titulo, descripcion, ubicacion],
    )

    const insertResult = result as { insertId: number }
    const denunciaId = insertResult.insertId

    // Link categories
    if (categoriaIds.length > 0) {
      const values = categoriaIds.map((catId) => [denunciaId, catId])
      await connection.query("INSERT INTO denuncia_categoria (id_denuncia, id_categoria) VALUES ?", [values])
    }

    await connection.commit()
    return denunciaId
  } catch (error) {
    await connection.rollback()
    console.error("[v0] Error creating denuncia:", error)
    return null
  } finally {
    connection.release()
  }
}

// Get all denuncias with optional filters
export async function getDenuncias(userId?: number, estado?: string): Promise<Denuncia[]> {
  try {
    let query = `
      SELECT d.*, u.nombre_completo, u.correo, u.tipo_usuario
      FROM denuncias d
      LEFT JOIN usuarios u ON d.id_usuario = u.id_usuario
    `
    const params: any[] = []

    const conditions: string[] = []
    if (userId) {
      conditions.push("d.id_usuario = ?")
      params.push(userId)
    }
    if (estado) {
      conditions.push("d.estado = ?")
      params.push(estado)
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ")
    }

    query += " ORDER BY d.fecha_creacion DESC"

    const [rows] = await executeQuery(query, params)
    const denuncias = rows as any[]

    // Get categories for each denuncia
    const denunciasWithCategories = await Promise.all(
      denuncias.map(async (denuncia) => {
        const [catRows] = await executeQuery(
          `SELECT c.* FROM categorias c
           INNER JOIN denuncia_categoria dc ON c.id_categoria = dc.id_categoria
           WHERE dc.id_denuncia = ?`,
          [denuncia.id_denuncia],
        )
        return {
          ...denuncia,
          categorias: catRows as Categoria[],
          usuario: denuncia.nombre_completo
            ? {
                id_usuario: denuncia.id_usuario,
                nombre_completo: denuncia.nombre_completo,
                correo: denuncia.correo,
                tipo_usuario: denuncia.tipo_usuario,
              }
            : null,
        }
      }),
    )

    return denunciasWithCategories as Denuncia[]
  } catch (error) {
    console.error("[v0] Error fetching denuncias:", error)
    return []
  }
}

// Get single denuncia by ID
export async function getDenunciaById(id: number): Promise<Denuncia | null> {
  try {
    const [rows] = await executeQuery(
      `SELECT d.*, u.nombre_completo, u.correo, u.tipo_usuario
       FROM denuncias d
       LEFT JOIN usuarios u ON d.id_usuario = u.id_usuario
       WHERE d.id_denuncia = ?`,
      [id],
    )

    const denuncias = rows as any[]
    if (denuncias.length === 0) return null

    const denuncia = denuncias[0]

    // Get categories
    const [catRows] = await executeQuery(
      `SELECT c.* FROM categorias c
       INNER JOIN denuncia_categoria dc ON c.id_categoria = dc.id_categoria
       WHERE dc.id_denuncia = ?`,
      [id],
    )

    return {
      ...denuncia,
      categorias: catRows as Categoria[],
      usuario: denuncia.nombre_completo
        ? {
            id_usuario: denuncia.id_usuario,
            nombre_completo: denuncia.nombre_completo,
            correo: denuncia.correo,
            tipo_usuario: denuncia.tipo_usuario,
          }
        : null,
    } as Denuncia
  } catch (error) {
    console.error("[v0] Error fetching denuncia:", error)
    return null
  }
}

// Update denuncia status (admin only)
export async function updateDenunciaEstado(
  id: number,
  estado: "pendiente" | "en revisión" | "aceptada" | "rechazada" | "resuelta",
): Promise<boolean> {
  try {
    await executeQuery("UPDATE denuncias SET estado = ? WHERE id_denuncia = ?", [estado, id])
    return true
  } catch (error) {
    console.error("[v0] Error updating denuncia status:", error)
    return false
  }
}

// Add evidence to denuncia
export async function addEvidencia(
  denunciaId: number,
  tipo: "imagen" | "video" | "documento",
  urlArchivo: string,
): Promise<boolean> {
  try {
    await executeQuery("INSERT INTO evidencias (id_denuncia, tipo, url_archivo) VALUES (?, ?, ?)", [
      denunciaId,
      tipo,
      urlArchivo,
    ])
    return true
  } catch (error) {
    console.error("[v0] Error adding evidence:", error)
    return false
  }
}

// Get evidence for a denuncia
export async function getEvidencias(denunciaId: number): Promise<Evidencia[]> {
  try {
    const [rows] = await executeQuery("SELECT * FROM evidencias WHERE id_denuncia = ? ORDER BY fecha_subida DESC", [
      denunciaId,
    ])
    return rows as Evidencia[]
  } catch (error) {
    console.error("[v0] Error fetching evidence:", error)
    return []
  }
}

// Add seguimiento (tracking comment)
export async function addSeguimiento(denunciaId: number, userId: number, comentario: string): Promise<boolean> {
  try {
    await executeQuery("INSERT INTO seguimientos (id_denuncia, id_usuario, comentario) VALUES (?, ?, ?)", [
      denunciaId,
      userId,
      comentario,
    ])
    return true
  } catch (error) {
    console.error("[v0] Error adding seguimiento:", error)
    return false
  }
}

// Get seguimientos for a denuncia
export async function getSeguimientos(denunciaId: number): Promise<any[]> {
  try {
    const [rows] = await executeQuery(
      `SELECT s.*, u.nombre_completo, u.tipo_usuario
       FROM seguimientos s
       INNER JOIN usuarios u ON s.id_usuario = u.id_usuario
       WHERE s.id_denuncia = ?
       ORDER BY s.fecha DESC`,
      [denunciaId],
    )
    return rows as any[]
  } catch (error) {
    console.error("[v0] Error fetching seguimientos:", error)
    return []
  }
}

// Get dashboard statistics
export async function getDashboardStats(): Promise<{
  total: number
  pendiente: number
  enRevision: number
  aceptada: number
  rechazada: number
  resuelta: number
}> {
  try {
    const [rows] = await executeQuery(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) as pendiente,
        SUM(CASE WHEN estado = 'en revisión' THEN 1 ELSE 0 END) as enRevision,
        SUM(CASE WHEN estado = 'aceptada' THEN 1 ELSE 0 END) as aceptada,
        SUM(CASE WHEN estado = 'rechazada' THEN 1 ELSE 0 END) as rechazada,
        SUM(CASE WHEN estado = 'resuelta' THEN 1 ELSE 0 END) as resuelta
      FROM denuncias
    `)
    const stats = rows as any[]
    return {
      total: Number(stats[0].total),
      pendiente: Number(stats[0].pendiente),
      enRevision: Number(stats[0].enRevision),
      aceptada: Number(stats[0].aceptada),
      rechazada: Number(stats[0].rechazada),
      resuelta: Number(stats[0].resuelta),
    }
  } catch (error) {
    console.error("[v0] Error fetching dashboard stats:", error)
    return {
      total: 0,
      pendiente: 0,
      enRevision: 0,
      aceptada: 0,
      rechazada: 0,
      resuelta: 0,
    }
  }
}
