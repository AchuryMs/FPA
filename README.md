# 💹 FPA – Sistema de Gestión Bursátil

Proyecto académico desarrollado en el marco del **Caso de Estudio: Casa de Valores – Andina Trading**, perteneciente al curso **Ingeniería de Software II (Universidad El Bosque)**.

El sistema tiene como objetivo **gestionar la transacción de acciones** dentro de un entorno bursátil distribuido entre cuatro países (Ecuador, Perú, Venezuela y Colombia), permitiendo la interacción entre **inversionistas, comisionistas de bolsa y empresas emisoras de acciones**.

---

## 🧩 Objetivo general
Desarrollar un **sistema distribuido** que permita la **simulación, gestión y consolidación de transacciones bursátiles**, garantizando modularidad, mantenibilidad y escalabilidad limitada según el alcance académico del proyecto.

---

## ⚙️ Tecnologías principales

| Capa | Tecnología | Descripción |
|------|-------------|-------------|
| **Frontend** | React + Vite | Portal del Inversionista |
| **Backend** | Node.js + Express | API y microservicios |
| **Base de Datos** | MySQL | Persistencia de datos |
| **Orquestación** | Docker (futuro) | Contenedores y redes de servicios |
| **Gestión de código** | GitHub | Control de versiones y CI/CD |
| **Comunicación** | REST API | Conexión entre servicios y frontend |

---

## 🏗️ Estructura del repositorio

andina-trading/
├── frontend/ # Portal del Inversionista (React)
│ ├── public/
│ ├── src/
│ │ ├── assets/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/ # conexión al backend (axios / fetch)
│ │ ├── hooks/
│ │ ├── context/
│ │ └── App.jsx
│ ├── package.json
│ ├── vite.config.js
│ └── .env.example
│
├── backend/ # API y microservicios
│ ├── gateway/ # API Gateway
│ │ ├── src/
│ │ │ ├── routes/
│ │ │ ├── middlewares/
│ │ │ ├── controllers/
│ │ │ └── app.js
│ │ ├── package.json
│ │ └── .env.example
│ │
│ ├── services/
│ │ ├── auth-service/ # Login y gestión de usuarios
│ │ ├── investor-service/ # Gestión de inversionistas y contratos
│ │ ├── broker-service/ # Gestión de comisionistas
│ │ ├── stock-service/ # Conexión con la bolsa
│ │ └── report-service/ # Generación de reportes
│ │
│ ├── common/ # Código compartido entre servicios
│ │ ├── utils/
│ │ ├── constants/
│ │ ├── types/
│ │ └── database/
│ │ ├── db.js # Conexión MySQL central
│ │ └── models/
│ │
│ └── docker-compose.yml # Orquestación backend (futuro)
│
├── database/
│ ├── init.sql # Script de creación de tablas
│ ├── seed.sql # Datos iniciales
│ └── README.md
│
├── docs/ # Documentación del proyecto
│ ├── arquitectura.md
│ ├── requerimientos.md
│ ├── plan-calidad.md
│ └── presentacion.pptx
│
├── scripts/ # Utilidades de desarrollo y despliegue
│ ├── start-dev.sh
│ ├── test-all.sh
│ └── build-all.sh
│
├── .gitignore
├── README.md
└── LICENSE

yaml
Copiar código

---

## 🌐 Módulos principales

| Módulo | Descripción |
|---------|--------------|
| **Gestión del sistema** | Configuración general, parámetros, ciudades, países, auditoría y respaldo |
| **Conexión con bolsa de valores** | Comunicación con las bolsas locales en tiempo real |
| **Recepción de inversionistas** | Registro, contratos y cuentas de inversión |
| **Portal del inversionista** | Interfaz web para realizar operaciones de compra/venta |
| **Órdenes de compra/venta** | Procesamiento de transacciones bursátiles |
| **Consolidación de información** | Recolección y centralización de datos financieros |
| **Reportes** | Generación de informes y estadísticas |

---

## 🧠 Convenciones de trabajo

### Ramas
main # Rama estable
dev # Integración de features
feature/<nombre> # Nuevas funciones
fix/<nombre> # Correcciones
docs/<tema> # Documentación

shell
Copiar código

### Commits
Usar prefijos estandarizados:
feat: nueva funcionalidad
fix: corrección de errores
docs: cambios en documentación
refactor: mejora de código
chore: tareas menores o mantenimiento

yaml
Copiar código

---

## ⚡ Configuración de entorno

### Variables para backend
Archivo `.env` en cada servicio:
DB_HOST=localhost
DB_USER=root
DB_PASS=admin
DB_NAME=andina_trading
DB_PORT=3306
PORT=3001

bash
Copiar código

### Variables para frontend
Archivo `.env`:
VITE_API_URL=http://localhost:3000

yaml
Copiar código

---

## 🧩 Próximos pasos
1. Implementar la conexión con **MySQL** desde `backend/common/database/db.js`.  
2. Crear los **endpoints REST** en el `gateway` y servicios.  
3. Conectar el **frontend** al backend usando `axios`.  
4. Integrar **Docker Compose** para levantar el entorno completo.  

---

## 👥 Autores
Proyecto desarrollado por el **equipo de Ingeniería de Software II – Universidad El Bosque**, dentro del caso de estudio **Karen Buitrago, Andres Cuta y Miguel Sánchez**.

---
📘 *“El factor clave de éxito será la coordinación y el trabajo en equipo para producir un resultado coherente y funcional.”*  
— Caso de Estudio, Ing. Carlos Medina
