# API DE USUARIOS CON JWT

## CREDENCIALES
 - Nombre: Willy Estuardo Culajay Asturias
 - Carnet: 9490-22-3432
 - Seccion. "B"

## URL de la API DESPLEGADA EN RENDER

https://api-usuarios-jwt-3zqe.onrender.com

## Descripción
API para para implentacion de autenticación mediante el uso de JSON Web Token, utilizando Node.js y Express.js 
- al loguearse se crea un Token JWT.
- se protegen los endpoints de la API.
- solo los usuarios autenticados pueden acceder a las rutas indicadas

## Endpoints
- `POST /login`— crear Token.
- `POST /users` — crear usuario
- `GET  /users` — listar (filtros `?name=`, `?email=`, `?limit=`, `?offset=`)
- `PUT  /users/:dpi` — actualizar usuario por DPI
- `DELETE /users/:dpi` — eliminar usuario por DPI

## Variables de Entorno
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

## Instalación
1. Clonar el repositorio.
2. Instalar dependencias npm install
3. Crear un archivo `.env` con la variables de entorno necesarias.
4. Ejecutar `npm run dev` (desarrollo con nodemon)

#### POST/login
ejemplo de login de usuario y generacion de Token.
- Repuest:
```json
{
    "email": "usuario@ejemplo.com",
    "password": "Password1!"
}
```

Response:
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
### Usuarios
Todos estos endpoints requieren el token JWT en el header:
`Authorization: Bearer <token>`

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

