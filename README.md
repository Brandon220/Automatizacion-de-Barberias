# Backend Node.js + Express + MongoDB

API REST con estructura organizada para proyecto de barbería.

## Estructura del proyecto

```
├── src/
│   ├── config/
│   │   └── database.js      # Conexión a MongoDB
│   ├── models/
│   │   └── User.js          # Modelo de usuario
│   ├── routes/
│   │   └── userRoutes.js    # Rutas de usuarios
│   └── app.js               # Punto de entrada
├── .env.example             # Variables de entorno ejemplo
├── .gitignore
├── package.json
└── README.md
```

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Crear archivo .env desde el ejemplo
cp .env.example .env

# 3. Editar .env con tu URI de MongoDB
```

## Uso

```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

## Endpoints

| Método | Ruta                | Descripción           |
|--------|--------------------|-----------------------|
| GET    | /api/users         | Obtener todos         |
| GET    | /api/users/:id     | Obtener por ID        |
| POST   | /api/users         | Crear usuario         |
| PUT    | /api/users/:id     | Actualizar usuario    |
| DELETE | /api/users/:id     | Eliminar usuario      |
