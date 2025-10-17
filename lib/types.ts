export type TipoUsuario = "ciudadano" | "administrador"
export type TipoDenuncia = "oficial" | "anonima"
export type EstadoDenuncia = "pendiente" | "en revisión" | "aceptada" | "rechazada" | "resuelta"
export type TipoEvidencia = "imagen" | "video" | "documento"

export interface Usuario {
  id_usuario: number
  nombre_completo: string
  correo: string
  telefono?: string
  tipo_usuario: TipoUsuario
  fecha_registro: Date
}

export interface Categoria {
  id_categoria: number
  nombre_categoria: string
  descripcion?: string
}

export interface Denuncia {
  id_denuncia: number
  id_usuario?: number
  tipo_denuncia: TipoDenuncia
  titulo: string
  descripcion: string
  ubicacion?: string
  fecha_creacion: Date
  estado: EstadoDenuncia
  categorias?: Categoria[]
  usuario?: Usuario
}

export interface Evidencia {
  id_evidencia: number
  id_denuncia: number
  tipo: TipoEvidencia
  url_archivo: string
  fecha_subida: Date
}

export interface Seguimiento {
  id_seguimiento: number
  id_denuncia: number
  id_usuario: number
  comentario?: string
  fecha: Date
  usuario?: Usuario
}
