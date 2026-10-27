# Gestión de empleados — Frontend

CRUD de empleados en React 19 + TypeScript + Vite, con TanStack Query, React Hook Form + Zod, React Router y shadcn/ui (Tailwind CSS).

## Requisitos

- Node.js 20.19 o superior (probado con Node 24) y npm
- El backend corriendo en `http://localhost:8080`

## Configuración

Copia el archivo de ejemplo y ajusta la URL del backend si hace falta:

```bash
cp .env.example .env
```

```
VITE_API_URL=http://localhost:8080
```

## Levantar el backend

Desde la carpeta del backend (`../reactive_application`), arráncalo como de costumbre (por ejemplo `./gradlew bootRun` o `./mvnw spring-boot:run`, según el proyecto). Debe quedar escuchando en `localhost:8080`.

El backend solo permite por CORS el origen `http://localhost:5173`, por eso Vite está configurado con ese puerto fijo (`strictPort`): si está ocupado, el servidor no arranca en otro.

## Correr el frontend

```bash
npm install
npm run dev
```

Abre <http://localhost:5173>.

## Scripts

| Script | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo en el puerto 5173 |
| `npm run build` | Chequeo de tipos y build de producción en `dist/` |
| `npm run preview` | Sirve el build en el puerto 5173 |
| `npm test` | Tests con Vitest + Testing Library |
| `npm run lint` | ESLint |

## Estructura

```
src/
├── app/        # router, QueryClient, layout, Toaster
├── shared/     # httpClient, config de entorno, componentes UI
└── features/
    ├── catalogs/   # tipos de documento, roles, empresas
    └── employees/  # api, modelo + Zod, hooks, componentes, páginas
```

Los componentes y páginas nunca llaman a `fetch`: usan hooks, que usan las funciones de `api/`. Solo `api/` y `shared/api` conocen URLs.
