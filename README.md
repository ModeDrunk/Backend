# SafeNight Backend

## Descripción

El backend de la aplicación **SafeNight** para la gestión del "Modo Borracho". Este servicio está diseñado para proporcionar una API robusta y segura para la funcionalidad de seguridad ciudadana, permitiendo a los usuarios gestionar contactos de confianza y activar un modo de emergencia.

## 🚀 Tecnologías Utilizadas

*   **[NestJS](https://nestjs.com/):** Framework principal para la construcción de la API, proporcionando una arquitectura escalable y modular.
*   **[Prisma](https://www.prisma.io/):** ORM (Object-Relational Mapping) moderno para la interacción segura y tipada con la base de datos.
*   **[PostgreSQL](https://www.postgresql.org/):** Sistema de base de datos relacional. (Asumido por la configuración de Prisma).
*   **[JWT (JSON Web Tokens)](https://jwt.io/):** Utilizado para la autenticación y autorización de los usuarios.
*   **[TypeScript](https://www.typescriptlang.org/):** Lenguaje que proporciona tipado estático y mejoras en el código.

---

## 📁 Estructura del Proyecto

```bash
├── dist/                      # Código compilado (NO MODIFICAR)
├── node_modules/              # Dependencias del proyecto
├── prisma/
│   ├── migrations/            # Control de versiones de la base de datos
│   │   └── 20260519215910_init/
│   │       └── migration.sql  # Esquema SQL inicial
│   ├── schema.prisma          # Definición del modelo de datos y conexión
│   ├── seed.ts                # Script para poblar la base de datos con datos iniciales
│   └── migration_lock.toml    # Archivo de bloqueo de migraciones
├── src/
│   ├── auth/                  # Módulo de autenticación
│   │   ├── dto/               # Objetos de Transferencia de Datos (login, registro, refresh)
│   │   ├── strategies/        # Estrategias de Passport (JWT)
│   │   ├── auth.controller.ts # Controlador de rutas de autenticación
│   │   ├── auth.module.ts     # Módulo de autenticación
│   │   └── auth.service.ts    # Lógica de negocio para autenticación
│   ├── common/                # Recursos comunes y reutilizables
│   │   ├── decorators/        # Decoradores personalizados (ej. @Public)
│   │   ├── guards/            # Guards para proteger rutas (ej. JwtAuthGuard)
│   │   └── utils/             # Utilidades varias
│   ├── drunk-mode/            # Módulo principal de la funcionalidad "Modo Borracho"
│   │   ├── dto/               # DTOs para activar/desactivar el modo
│   │   ├── drunk-mode.controller.ts # Rutas para el Modo Borracho
│   │   ├── drunk-mode.module.ts     # Módulo del Modo Borracho
│   │   └── drunk-mode.service.ts    # Lógica de negocio del Modo Borracho
│   ├── prisma/                # Módulo de Prisma para inyección de dependencias
│   │   ├── prisma.module.ts   # Módulo de Prisma
│   │   └── prisma.service.ts  # Servicio para gestionar la conexión a la BD
│   ├── safe-contacts/         # Módulo para gestionar contactos de confianza
│   │   ├── dto/               # DTOs para crear/actualizar contactos
│   │   ├── safe-contacts.controller.ts # Rutas de contactos seguros
│   │   ├── safe-contacts.module.ts     # Módulo de contactos seguros
│   │   └── safe-contacts.service.ts    # Lógica de negocio de contactos
│   ├── app.controller.ts      # Controlador principal (ej. ruta raíz)
│   ├── app.module.ts          # Módulo raíz de la aplicación
│   ├── app.service.ts         # Servicio principal de la aplicación
│   └── main.ts                # Punto de entrada de la aplicación
├── test/                      # Pruebas E2E
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── .env                       # Variables de entorno (Base de datos, JWT, puerto)
├── .gitignore
├── .prettierrc                # Configuración de Prettier
├── docker-compose.yml         # Configuración para levantar servicios en contenedores
├── eslint.config.mjs          # Configuración de ESLint
├── nest-cli.json              # Configuración del CLI de NestJS
├── package.json               # Dependencias y scripts del proyecto
├── tsconfig.build.json        # Configuración de TypeScript para la compilación
└── tsconfig.json              # Configuración base de TypeScript
```

---

## ✨ Funcionalidades Principales

*   **Autenticación y Registro:**
    *   Registro de nuevos usuarios con validación de datos.
    *   Inicio de sesión seguro con generación de JWT.
    *   Renovación de tokens de acceso mediante un `refresh token`.
*   **Gestión de Contactos Seguros (`safe-contacts`):**
    *   Crear, listar, actualizar y eliminar contactos de confianza.
    *   Cada contacto almacena información como nombre, número de teléfono y relación.
*   **Modo Borracho (`drunk-mode`):**
    *   **Activar/Desactivar:** Endpoint para que el usuario active o desactive el modo de emergencia.
    *   **(Asumido) Notificaciones a Contactos:** Cuando se activa, el sistema envía una alerta a los contactos registrados (esta lógica se implementaría en el servicio).
*   **Seguridad:**
    *   Rutas protegidas mediante Guards de JWT.
    *   Uso de DTOs para validar y tipar los datos entrantes.
*   **Base de Datos:**
    *   Gestión de migraciones con Prisma para un esquema de BD versionado.

---

## 🛠️ Configuración y Ejecución

### **Prerrequisitos**

*   Node.js (versión 18 o superior)
*   npm, yarn o pnpm
*   Docker (Opcional, para levantar la base de datos)
*   PostgreSQL (Instalado localmente o vía Docker)

### **1. Clonar el repositorio**

```bash
git clone https://tu-repositorio.com/safenight-backend.git
cd safenight-backend
```

### **2. Instalar las dependencias**

```bash
npm install
# o
yarn install
# o
pnpm install
```

### **3. Configurar las variables de entorno**

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example` (si existe) o con la siguiente configuración mínima:

```env
# Puerto en el que correrá la aplicación
PORT=3000

# URL de conexión a la base de datos PostgreSQL
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/safenight_db?schema=public"

# Clave secreta para firmar los JWT
JWT_SECRET="clave_super_secreta_y_segura"
JWT_EXPIRATION="7d"

# Clave secreta para el Refresh Token
REFRESH_TOKEN_SECRET="otra_clave_secreta"
REFRESH_TOKEN_EXPIRATION="30d"
```

> **Importante:** Reemplaza `usuario`, `contraseña` y `safenight_db` con tus credenciales reales.

### **4. Levantar la base de datos (Opcional con Docker)**

Si usas Docker, puedes levantar una base de datos PostgreSQL con el siguiente comando:

```bash
docker-compose up -d
```

### **5. Ejecutar las migraciones de la base de datos**

```bash
npx prisma migrate deploy
# o para aplicar las migraciones y regenerar el cliente de Prisma
npx prisma migrate dev
```

### **6. Sembrar la base de datos (Opcional)**

Para agregar datos de prueba iniciales, ejecuta:

```bash
npx prisma db seed
```

### **7. Iniciar la aplicación**

*   **Modo Desarrollo (con Hot Reload):**
    ```bash
    npm run start:dev
    ```
*   **Modo Producción:**
    ```bash
    npm run build
    npm run start:prod
    ```

La aplicación estará disponible en: `http://localhost:3000`

---

## 📚 Documentación de la API

La documentación de la API se puede explorar mediante Swagger (si está implementado). Normalmente estará disponible en la ruta:

> **`http://localhost:3000/api-docs`**

### **Endpoints Principales**

#### **Autenticación (`/auth`)**
| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `POST` | `/auth/register` | Registrar un nuevo usuario |
| `POST` | `/auth/login` | Iniciar sesión y obtener un token |
| `POST` | `/auth/refresh` | Renovar el token de acceso |
| `GET` | `/auth/me` | Obtener información del perfil del usuario autenticado |

#### **Contactos Seguros (`/safe-contacts`)**
| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `POST` | `/safe-contacts` | Crear un nuevo contacto seguro |
| `GET` | `/safe-contacts` | Listar todos los contactos del usuario |
| `GET` | `/safe-contacts/:id` | Obtener un contacto específico |
| `PATCH` | `/safe-contacts/:id` | Actualizar un contacto |
| `DELETE` | `/safe-contacts/:id` | Eliminar un contacto |

#### **Modo Borracho (`/drunk-mode`)**
| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `POST` | `/drunk-mode/activate` | Activar el modo de emergencia |
| `POST` | `/drunk-mode/deactivate` | Desactivar el modo de emergencia |

---

## 🧪 Pruebas

Para ejecutar las pruebas unitarias y E2E, usa:

```bash
# Pruebas unitarias
npm run test

# Pruebas E2E
npm run test:e2e

# Cobertura de código
npm run test:cov
```

---

## 🤝 Cómo Contribuir

1.  Realiza un fork del proyecto.
2.  Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3.  Realiza los cambios y haz commit de los mismos (`git commit -m 'Add: nueva funcionalidad'`).
4.  Sube los cambios a tu repositorio (`git push origin feature/nueva-funcionalidad`).
5.  Abre un Pull Request.

---

## 📜 Licencia

[MIT](LICENSE)

---

### **Notas adicionales para los desarrolladores:**

*   **Seguridad:** Nunca subas el archivo `.env` a tu repositorio. Asegúrate de que esté en el `.gitignore`.
*   **Prisma:** Cuando modifiques `schema.prisma`, no olvides ejecutar `npx prisma generate` y crear una nueva migración con `npx prisma migrate dev --name nombre_de_la_migracion`.
*   **Dependencias:** Revisa que `package.json` incluya todas las dependencias utilizadas en la estructura (`@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `@prisma/client`, `bcrypt`, `class-validator`, etc.).
EOF
```