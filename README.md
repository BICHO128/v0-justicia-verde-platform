# Justicia Verde - Plataforma de Denuncias Ambientales

Plataforma ciudadana para denunciar, visibilizar y combatir delitos ambientales en Colombia mediante tecnología, participación ciudadana y apoyo legal.

## Características Principales

### Para Ciudadanos
- **Registro y Autenticación**: Sistema seguro de cuentas de usuario
- **Denuncias Oficiales y Anónimas**: Opción de reportar con o sin identificación
- **Categorización**: Clasificación por tipo de delito ambiental (deforestación, contaminación, caza ilegal, etc.)
- **Seguimiento en Tiempo Real**: Visualización del estado de las denuncias
- **Notificaciones por Email**: Alertas automáticas cuando cambia el estado de una denuncia
- **Historial Completo**: Acceso a todas las denuncias propias y su progreso

### Para Administradores
- **Panel de Control**: Dashboard con estadísticas y métricas clave
- **Gestión de Denuncias**: Revisión y actualización de estados
- **Sistema de Seguimiento**: Comentarios y actualizaciones para cada caso
- **Notificaciones**: Alertas de nuevas denuncias pendientes
- **Filtros Avanzados**: Organización por estado, categoría y fecha
- **Vista Tabular**: Gestión eficiente de múltiples denuncias

## Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript
- **Estilos**: Tailwind CSS v4, shadcn/ui
- **Backend**: Next.js API Routes, Node.js
- **Base de Datos**: MySQL con mysql2
- **Autenticación**: bcryptjs para hash de contraseñas
- **Notificaciones**: Nodemailer para emails

## Estructura de la Base de Datos

- **usuarios**: Gestión de cuentas (ciudadanos y administradores)
- **denuncias**: Registro de denuncias ambientales
- **categorias**: Tipos de delitos ambientales
- **evidencias**: Archivos adjuntos (imágenes, videos, documentos)
- **seguimientos**: Comentarios y actualizaciones administrativas
- **denuncia_categoria**: Relación muchos a muchos entre denuncias y categorías

## Configuración

### Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

\`\`\`env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=justicia_verde
DB_PORT=3306

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### Instalación

1. Instalar dependencias:
\`\`\`bash
npm install
\`\`\`

2. Configurar la base de datos:
   - Ejecutar el script `scripts/01-create-database.sql` para crear las tablas
   - Ejecutar el script `scripts/02-seed-data.sql` para datos de prueba (opcional)

3. Iniciar el servidor de desarrollo:
\`\`\`bash
npm run dev
\`\`\`

4. Abrir [http://localhost:3000](http://localhost:3000) en el navegador

## Flujo de Trabajo

### Ciudadano
1. Registrarse en la plataforma
2. Crear una denuncia (oficial o anónima)
3. Seleccionar categorías relevantes
4. Agregar descripción y ubicación
5. Recibir notificaciones por email sobre actualizaciones
6. Ver seguimiento y comentarios administrativos

### Administrador
1. Acceder al panel de administración
2. Revisar denuncias pendientes
3. Actualizar estados (en revisión, aceptada, rechazada, resuelta)
4. Agregar comentarios de seguimiento
5. Gestionar múltiples casos desde la vista tabular

## Estados de Denuncias

- **Pendiente**: Recién creada, esperando revisión
- **En Revisión**: Siendo evaluada por el equipo
- **Aceptada**: Validada y en proceso de acción
- **Rechazada**: No procede según criterios
- **Resuelta**: Caso completado exitosamente

## Notificaciones

El sistema envía notificaciones automáticas por email cuando:
- Se actualiza el estado de una denuncia (para usuarios)
- Se crea una nueva denuncia (para administradores)
- Se agregan comentarios de seguimiento

## Seguridad

- Contraseñas hasheadas con bcrypt (10 rounds)
- Consultas parametrizadas para prevenir SQL injection
- Autenticación basada en sesión con localStorage
- Rutas protegidas con verificación de roles
- Validación de datos en frontend y backend

## Contribuir

Este proyecto está diseñado para proteger el medio ambiente colombiano. Las contribuciones son bienvenidas para mejorar la plataforma y su impacto.

## Licencia

© 2025 Justicia Verde. Todos los derechos reservados.
