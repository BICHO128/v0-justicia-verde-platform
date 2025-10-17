-- Seed initial data for Justicia Verde
USE justicia_verde;

-- Insert categorias
INSERT INTO categorias (nombre_categoria, descripcion) VALUES
('Deforestación', 'Tala ilegal de bosques y árboles'),
('Contaminación del Agua', 'Vertimiento de residuos en ríos, lagos y mares'),
('Contaminación del Aire', 'Emisiones tóxicas y humo industrial'),
('Caza Ilegal', 'Caza de especies protegidas'),
('Minería Ilegal', 'Extracción no autorizada de minerales'),
('Residuos Tóxicos', 'Disposición inadecuada de desechos peligrosos');

-- Insert sample usuarios (password is 'password123' hashed with bcrypt)
-- Note: In production, use proper bcrypt hashing
INSERT INTO usuarios (nombre_completo, correo, telefono, contrasena, tipo_usuario) VALUES
('Juan Pérez', 'juan.perez@example.com', '3001234567', '$2b$10$rKZvVxZ5vXqZ5vXqZ5vXqOeKqZ5vXqZ5vXqZ5vXqZ5vXqZ5vXqZ5v', 'ciudadano'),
('María González', 'maria.gonzalez@example.com', '3009876543', '$2b$10$rKZvVxZ5vXqZ5vXqZ5vXqOeKqZ5vXqZ5vXqZ5vXqZ5vXqZ5vXqZ5v', 'administrador'),
('Carlos Rodríguez', 'carlos.rodriguez@example.com', '3005551234', '$2b$10$rKZvVxZ5vXqZ5vXqZ5vXqOeKqZ5vXqZ5vXqZ5vXqZ5vXqZ5vXqZ5v', 'ciudadano');

-- Insert sample denuncias
INSERT INTO denuncias (id_usuario, tipo_denuncia, titulo, descripcion, ubicacion, estado) VALUES
(1, 'oficial', 'Tala ilegal en el Amazonas', 'Se observa tala masiva de árboles en zona protegida del Amazonas colombiano', 'Amazonas, Colombia', 'pendiente'),
(1, 'oficial', 'Contaminación del río Bogotá', 'Empresa textil vertiendo químicos al río Bogotá', 'Bogotá, Cundinamarca', 'en revisión'),
(NULL, 'anonima', 'Caza de jaguares', 'Grupo de cazadores furtivos operando en el Parque Nacional', 'Parque Nacional Natural Tayrona', 'pendiente'),
(3, 'oficial', 'Minería ilegal en Chocó', 'Extracción de oro sin permisos ambientales', 'Chocó, Colombia', 'aceptada'),
(NULL, 'anonima', 'Quema de bosques', 'Incendios provocados para ganadería', 'Meta, Colombia', 'pendiente');

-- Link denuncias with categorias
INSERT INTO denuncia_categoria (id_denuncia, id_categoria) VALUES
(1, 1), -- Deforestación
(2, 2), -- Contaminación del Agua
(3, 4), -- Caza Ilegal
(4, 5), -- Minería Ilegal
(5, 1); -- Deforestación

-- Insert sample evidencias
INSERT INTO evidencias (id_denuncia, tipo, url_archivo) VALUES
(1, 'imagen', '/uploads/evidencia-1-foto.jpg'),
(2, 'video', '/uploads/evidencia-2-video.mp4'),
(4, 'documento', '/uploads/evidencia-4-reporte.pdf');

-- Insert sample seguimientos
INSERT INTO seguimientos (id_denuncia, id_usuario, comentario) VALUES
(2, 2, 'Caso tomado para revisión. Se contactará a las autoridades ambientales.'),
(4, 2, 'Caso aceptado. Se ha iniciado investigación con la Policía Ambiental.');
