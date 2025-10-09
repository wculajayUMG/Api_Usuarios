# Users API (REST) - Node.js + Express
## URL 
    
## Descripción
API para gestionar usuarios (crear, listar, actualizar, eliminar) con validaciones:
- DPI único y exactamente 13 dígitos numéricos.
- Email único y formato válido.
- Password mínimo 8 caracteres, 1 mayúscula, 1 número y 1 símbolo.

## Endpoints
- `POST /users` — crear usuario
- `GET  /users` — listar (filtros `?name=`, `?email=`, `?limit=`, `?offset=`)
- `PUT  /users/:dpi` — actualizar usuario por DPI
- `DELETE /users/:dpi` — eliminar usuario por DPI

## Ejecutar localmente
1. `git clone <repo>`
2. `npm install`
3. `npm run dev` (desarrollo con nodemon) o `npm start` (producción)
4. API escucha en `http://localhost:3000` (o en `process.env.PORT` si se usa PaaS)

## Ejemplos:
1. Crear Usuario
    POST http://localhost:3000/users \
   '{
      "dpi":"1234567890123",
      "nombre":"María López",
      "email":"maria.lopez@example.com",
      "password":"MiPass@123"
    }'
2. Listar:
    "http://localhost:3000/users?limit=5&offset=0"
    "http://localhost:3000/users?nombre=mar"
    "http://localhost:3000/users?email=maria.lopez@example.com"
3. Actualizar:
    PUT http://localhost:3000/users/1234567890123 \
    '{"email":"maria.nuevo@example.com","password":"NuevoP@ss1"}'

4. Cambiar DPI:
    PUT http://localhost:3000/users/1234567890123 \
    '{"nuevoDpi":"3210987654321"}'

5. Eliminar:
    DELETE http://localhost:3000/users/3210987654321

