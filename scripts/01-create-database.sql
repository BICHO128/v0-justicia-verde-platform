-- Create database and tables for Justicia Verde
CREATE DATABASE IF NOT EXISTS justicia_verde;
USE justicia_verde;

-- Usuarios table
CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre_completo VARCHAR(100) NOT NULL,
  correo VARCHAR(100) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  contrasena VARCHAR(255) NOT NULL,
  tipo_usuario ENUM('ciudadano', 'administrador') DEFAULT 'ciudadano',
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categorias table
CREATE TABLE IF NOT EXISTS categorias (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nombre_categoria VARCHAR(100) NOT NULL,
  descripcion TEXT
);

-- Denuncias table
CREATE TABLE IF NOT EXISTS denuncias (
  id_denuncia INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NULL,
  tipo_denuncia ENUM('oficial', 'anonima') NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT NOT NULL,
  ubicacion VARCHAR(200),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado ENUM('pendiente', 'en revisión', 'aceptada', 'rechazada', 'resuelta') DEFAULT 'pendiente',
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
);

-- Evidencias table
CREATE TABLE IF NOT EXISTS evidencias (
  id_evidencia INT AUTO_INCREMENT PRIMARY KEY,
  id_denuncia INT NOT NULL,
  tipo ENUM('imagen', 'video', 'documento') NOT NULL,
  url_archivo VARCHAR(255) NOT NULL,
  fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_denuncia) REFERENCES denuncias(id_denuncia) ON DELETE CASCADE
);

-- Seguimientos table
CREATE TABLE IF NOT EXISTS seguimientos (
  id_seguimiento INT AUTO_INCREMENT PRIMARY KEY,
  id_denuncia INT NOT NULL,
  id_usuario INT NOT NULL,
  comentario TEXT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_denuncia) REFERENCES denuncias(id_denuncia) ON DELETE CASCADE,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- Denuncia_categoria junction table
CREATE TABLE IF NOT EXISTS denuncia_categoria (
  id_denuncia INT NOT NULL,
  id_categoria INT NOT NULL,
  PRIMARY KEY (id_denuncia, id_categoria),
  FOREIGN KEY (id_denuncia) REFERENCES denuncias(id_denuncia) ON DELETE CASCADE,
  FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE CASCADE
);
