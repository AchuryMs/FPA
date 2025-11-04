# 💹 FPA – Sistema de Gestión Bursátil

Proyecto académico desarrollado en el marco del caso de estudio **“Casa de Valores – Andina Trading”**, perteneciente al curso **Ingeniería de Software II – Universidad El Bosque**.

El sistema permite la **simulación y gestión de transacciones bursátiles** entre inversionistas, comisionistas y empresas emisoras en un entorno distribuido multi-país (Ecuador, Perú, Venezuela y Colombia), priorizando modularidad, mantenibilidad y escalabilidad controlada.

---

## 🧭 Objetivo general

Desarrollar un **sistema distribuido** que permita la **gestión, simulación y consolidación de operaciones bursátiles** mediante una arquitectura basada en **microservicios**, un **API Gateway** central y un **portal web React** para inversionistas.

---

## ⚙️ Tecnologías principales

| Capa | Tecnología | Descripción |
|------|-------------|-------------|
| **Frontend** | React + Vite | Portal del inversionista y panel de control |
| **Backend** | Node.js + Express (microservicios) | APIs independientes para cada módulo |
| **Base de Datos** | MySQL | Persistencia relacional de datos |
| **Gateway** | Express + http-proxy-middleware | Orquestación de rutas y seguridad |
| **Orquestación (futuro)** | Docker + Docker Compose | Contenedorización del entorno completo |
| **Control de versiones** | GitHub | Gestión del código y CI/CD |
| **Comunicación** | REST API | Interacción entre frontend y servicios |

---

## 🏗️ Estructura del repositorio

```
andina-trading/
├── frontend/                    # Portal del Inversionista (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/            # Conexión con Gateway (axios)
│   │   ├── context/
│   │   └── App.jsx
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
├── backend/                     # Backend y microservicios
│   ├── gateway/                 # API Gateway
│   │   ├── proxy.js
│   │   ├── app.js
│   │   ├── package.json
│   │   └── .env.example
│   │
│   ├── services/
│   │   ├── authentication-service/   # Login y registro de usuarios
│   │   ├── contract-service/         # Gestión de contratos e inversionistas
│   │   ├── broker-service/           # Gestión de comisionistas
│   │   ├── stock-service/            # Conexión con bolsas locales
│   │   └── report-service/           # Generación de informes
│   │
│   ├── common/                       # Código compartido
│   │   ├── utils/
│   │   ├── constants/
│   │   └── database/
│   │       └── db.js
│   │
│   └── docker-compose.yml            # (Futuro) Orquestación de microservicios
│
├── database/
│   ├── init.sql                      # Creación de tablas
│   ├── seed.sql                      # Datos iniciales
│   └── README.md
│
├── docs/
│   ├── arquitectura.md
│   ├── requerimientos.md
│   ├── plan-calidad.md
│   └── presentacion.pptx
│
├── scripts/                          # Utilidades
│   ├── start-dev.sh
│   ├── test-all.sh
│   └── build-all.sh
│
└── README.md
```

---

## 🧩 Arquitectura de comunicación

```
[Frontend React]
       │
       ▼
 ┌───────────────┐
 │ API Gateway   │  ← http://localhost:3001
 └───────────────┘
       │
       ├── /api/auth        → authentication-service (3003)
       ├── /api/contracts   → contract-service (3005)
       ├── /api/brokers     → broker-service
       ├── /api/stocks      → stock-service
       └── /api/reports     → report-service
```

Cada microservicio mantiene su propia conexión a **MySQL** y es accesible únicamente a través del **Gateway**.

---

## 🗄️ Base de Datos (MySQL)

El sistema utiliza **MySQL 8.x** como RDBMS principal.

### Archivos relevantes
- `/database/init.sql` → contiene el esquema de creación de tablas (`users`, `contracts`, `transactions`, etc.).  
- `/database/seed.sql` → inserta datos iniciales para pruebas.  
- Cada servicio se conecta a la base mediante su propio pool configurado en `.env`.

### Conexión ejemplo (Node.js)
```js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});
```

---

## 🚀 Ejecución del proyecto

### 🔧 1. Configuración del entorno

#### Backend (.env)
Ejemplo de variables por servicio:

```env
# Ejemplo para authentication-service
PORT=3003
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=root
DB_NAME=andina_auth
JWT_SECRET=supersecreto123
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

---

### 🖥️ 2. Ejecución del Backend

Abre una terminal por cada servicio:

```bash
# Gateway
cd backend/gateway
npm install
npm run dev

# Authentication Service
cd ../services/authentication-service
npm install
npm run dev

# Contract Service
cd ../contract-service
npm install
npm run dev
```

Cada servicio se inicia en su propio puerto:
- Gateway → `http://localhost:3001`
- Auth Service → `http://localhost:3003`
- Contract Service → `http://localhost:3005`

---

### 💻 3. Ejecución del Frontend

```bash
cd frontend
npm install
npm run dev
```

El portal quedará disponible en:
```
http://localhost:5173
```

---

## 📡 Endpoints principales

### 🔑 Auth Service (`/api/auth`)
| Método | Endpoint | Descripción |
|---------|-----------|-------------|
| `POST` | `/api/auth/register` | Registro de usuario |
| `POST` | `/api/auth/login` | Inicio de sesión |
| `GET` | `/api/auth/me` | Información del usuario autenticado |
| `GET` | `/api/auth/role?id=<id>` | Rol de usuario |
| `GET` | `/api/auth/test` | Verificación de servicio |

### 📄 Contract Service (`/api/contracts`)
| Método | Endpoint | Descripción |
|---------|-----------|-------------|
| `GET` | `/api/contracts` | Listar contratos |
| `POST` | `/api/contracts` | Crear contrato |
| `GET` | `/api/contracts/:id` | Consultar contrato |
| `PUT` | `/api/contracts/:id` | Actualizar contrato |

(Otros servicios siguen estructura similar.)

---

## 🧠 Convenciones de trabajo

### Ramas
```
main                  # Rama estable
dev                   # Integración de features
feature/<nombre>      # Nuevas funciones
fix/<nombre>          # Correcciones
docs/<tema>           # Documentación
```

### Commits
Prefijos recomendados:
```
feat: nueva funcionalidad
fix: corrección de errores
docs: cambios en documentación
refactor: mejora interna
chore: tareas menores
```

---

## 🧩 Próximos pasos

- Conexión del frontend con el gateway vía Axios (`VITE_API_URL`).
- Integración de Docker Compose para levantar todos los servicios.
- Implementación de autenticación JWT en frontend.
- Pruebas unitarias de microservicios con Jest/Supertest.

---

## 👥 Autores

Proyecto desarrollado por el equipo del curso **Ingeniería de Software II – Universidad El Bosque**  
**Caso de estudio:** *Casa de Valores Andina Trading*

**Integrantes:**
- Karen Buitrago  
- Andrés Cuta  
- Miguel Sánchez  
