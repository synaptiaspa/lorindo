# LoRindo — Backoffice SaaS Multi-tenant

Sistema SaaS para gestión de rendiciones de gastos empresariales.

## Stack
- **Backend**: Node.js 20 + Fastify 4 + Prisma 5 + PostgreSQL 16
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Cache/Colas**: Redis 7 + BullMQ
- **Infra**: Docker + Nginx + GitHub Actions

## Inicio rápido

```bash
# 1. Clonar e instalar
git clone https://github.com/tu-org/lorindo.git
cd lorindo
pnpm install

# 2. Configurar variables de entorno
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 3. Levantar servicios de infraestructura
cd infra && docker compose up postgres redis -d

# 4. Inicializar la base de datos
cd ../apps/api
pnpm prisma generate
pnpm prisma migrate deploy
pnpm prisma db seed

# 5. Iniciar en modo desarrollo
cd ../..
pnpm dev
```

## Acceso inicial
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Swagger UI: http://localhost:3001/docs
- Usuario: admin@lorindo.cl / Lorindo2026! (cambiar inmediatamente)

## Estructura
```
lorindo/
├── apps/
│   ├── api/          # Backend Fastify
│   └── web/          # Frontend Next.js
├── packages/
│   └── types/        # Tipos compartidos
├── infra/
│   ├── docker-compose.yml
│   ├── nginx/
│   └── k8s/
└── .github/
    └── workflows/
```

## Documentación
Ver `LoRindo_Stack_Instalacion.docx` para la guía completa de instalación.
=======
# lorindo
>>>>>>> 89cb8d4123d5647024d21472e4cae1d73bbe54de
