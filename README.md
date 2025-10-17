# Justicia Verde - Plataforma de Denuncias Ambientales

Plataforma ciudadana para denunciar, visibilizar y combatir delitos ambientales en Colombia mediante tecnología, participación ciudadana y apoyo legal.

## Características Principales

### Para Ciudadanos
- **Registro y Autenticación**: Sistema seguro de cuentas de usuario
- **Denuncias Oficiales y Anónimas**: Opción de reportar con o sin identificación
- **Categorización**: Clasificación por tipo de delito ambiental (deforestación, contaminación, caza ilegal, etc.)
- **Seguimiento en Tiempo Real**: Visualización del estado de las denuncias
- **Historial Completo**: Acceso a todas las denuncias propias y su progreso

### Para Administradores
- **Panel de Control**: Dashboard con estadísticas y métricas clave
- **Gestión de Denuncias**: Revisión y actualización de estados
- **Sistema de Seguimiento**: Comentarios y actualizaciones para cada caso
- **Filtros Avanzados**: Organización por estado, categoría y fecha
- **Vista Tabular**: Gestión eficiente de múltiples denuncias

## Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript
- **Estilos**: CSS Modules, Tailwind CSS v4
- **UI Components**: Radix UI primitives
- **Backend**: Next.js API Routes
- **Base de Datos**: MySQL con mysql2
- **Autenticación**: bcryptjs para hash de contraseñas

## Estructura de la Base de Datos

- **usuarios**: Gestión de cuentas (ciudadanos y administradores)
- **denuncias**: Registro de denuncias ambientales
- **categorias**: Tipos de delitos ambientales
- **evidencias**: Archivos adjuntos (imágenes, videos, documentos)
- **seguimientos**: Comentarios y actualizaciones administrativas
- **denuncia_categoria**: Relación muchos a muchos entre denuncias y categorías

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de nuevos usuarios
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/me` - Obtener usuario actual

### Denuncias
- `GET /api/denuncias` - Listar denuncias (con filtros opcionales)
- `POST /api/denuncias` - Crear nueva denuncia
- `GET /api/denuncias/[id]` - Obtener denuncia específica
- `PUT /api/denuncias/[id]` - Actualizar estado de denuncia

### Categorías
- `GET /api/categorias` - Listar todas las categorías

### Evidencias
- `GET /api/evidencias?denunciaId=[id]` - Obtener evidencias de una denuncia
- `POST /api/evidencias` - Agregar evidencia a una denuncia

### Seguimientos
- `GET /api/seguimientos?denunciaId=[id]` - Obtener seguimientos de una denuncia
- `POST /api/seguimientos` - Agregar comentario de seguimiento

### Estadísticas
- `GET /api/stats` - Obtener estadísticas del dashboard

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
5. Ver seguimiento y comentarios administrativos

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

## Seguridad

- Contraseñas hasheadas con bcrypt (10 rounds)
- Consultas parametrizadas para prevenir SQL injection
- Autenticación basada en sesión con localStorage
- Rutas protegidas con verificación de roles
- Validación de datos en frontend y backend

## Estructura del Proyecto

\`\`\`
justicia-verde/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── auth/            # Autenticación
│   │   ├── denuncias/       # Gestión de denuncias
│   │   ├── categorias/      # Categorías
│   │   ├── evidencias/      # Evidencias
│   │   ├── seguimientos/    # Seguimientos
│   │   └── stats/           # Estadísticas
│   ├── admin/               # Panel administrativo
│   ├── denuncias/           # Gestión de denuncias
│   ├── login/               # Página de login
│   ├── register/            # Página de registro
│   └── page.tsx             # Página principal
├── components/              # Componentes React
│   ├── ui/                  # Componentes UI base
│   ├── navbar.tsx           # Barra de navegación
│   ├── protected-route.tsx  # HOC para rutas protegidas
│   └── seguimientos-section.tsx
├── contexts/                # React Contexts
│   └── auth-context.tsx     # Contexto de autenticación
├── lib/                     # Utilidades y lógica de negocio
│   ├── auth.ts              # Funciones de autenticación
│   ├── db.ts                # Configuración de base de datos
│   ├── denuncias.ts         # Lógica de denuncias
│   └── types.ts             # Tipos TypeScript
└── scripts/                 # Scripts SQL
    ├── 01-create-database.sql
    └── 02-seed-data.sql
\`\`\`

## Contribuir

Este proyecto está diseñado para proteger el medio ambiente colombiano. Las contribuciones son bienvenidas para mejorar la plataforma y su impacto.

## Licencia

© 2025 Justicia Verde. Todos los derechos reservados.
