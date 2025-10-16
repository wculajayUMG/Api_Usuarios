import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();

app.use(cors());
app.use(morgan());
app.use(express.json());

app.listen(3000, ()=>{
    console.log('el servidor esta corriendo en el puerto 3000');
});

app.get('/', (req, res) =>{
    res.send('Api con autenticacion JWT');
})


let users = []

//validaciones

// validar DPI
function esDPIValido(dpi) {
    if (typeof dpi !== 'string') return false;
    if(dpi.length !== 13) return false;
    for(let i= 0; i<dpi.length; i++){
        if(dpi[i]<'0' || dpi[i]>'9') {
            return false;
        }

    }
    return true;
}

// validar correo

function esEmailValido(email){
if(typeof email !== 'string') return false;
const partes = email.split('@');
if(partes.length !== 2) return false;
if(partes[0].length === 0 || partes[1].length === 0) return false;
if(!partes[1].includes('.')) return false;
return true;

}
// validar contraseña al menos 8 caracteres, una mayuscula, un numero y un simbolo

function esPasswordValido(password){
if(typeof password !== 'string') return false;
if(password.length < 8) return false;
let tieneMayuscula = false;
let tieneNumero = false;
let tieneSimbolo = false;   
const simbolos = '!@#$%^&*()_+[]{}|;:,.<>?/~`-=';

for(let i=0; i<password.length; i++){
    const c = password[i];   
    if(c >= 'A' && c <= 'Z') tieneMayuscula = true;
    else if(c >= '0' && c <= '9') tieneNumero = true;
    else if(simbolos.includes(c)) tieneSimbolo = true;  

}

return tieneMayuscula && tieneNumero && tieneSimbolo;

}

//Middleware de verificacion de token
const verificarToken = (req, res, next) =>{
    const token = req.header('Authorization')?.replace('Bearer','');

    if(!token){
        return res.status(401).json({error: 'Acceso denegado. Token no proporcionado'});
    }

    try{
        const verificado = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = verificado;
        next();

    } catch (error){
        
        res.status(400).json({error: 'Token no es valido'});

    }


}

//endopoint para login 

app.post('/login', async (req, res) =>{
    const {email, password} = req.body;

    // Validar campos
    if(!email || !password){
        return res.status(400).json({error: 'Todos los campos son obligatorios'});
    }

    // Verificar si el usuario existe
    const usuario = users.find(u => u.email === email);
    if(!usuario){
        return res.status(404).json({error: 'Usuario no encontrado'});
    }

    // Verificar contraseña
    
    if(password !== usuario.password){
        return res.status(401).json({error: 'Contraseña incorrecta'});
    }

    // Generar token
    const token = jwt.sign({id: usuario.dpi, email : usuario.email}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
    
    res.json({token});
});

// endpoints
app.post('/users', (req, res) =>{
    const {dpi, nombre, email, password} = req.body;

    if(!dpi || !nombre || !email || !password){
        return res.status(400).json({error: 'Todos los son campos obligatorios'});
    }
    if(!esDPIValido(dpi)){
        return res.status(400).json({error:'DPI no es valido'});
    }
    if(!esEmailValido(email)){
        return res.status(400).json({error:'Email no es valido'});
    }
    if(!esPasswordValido(password)){
        return res.status(400).json({error:'Password no es valido'});
    }
    if(users.find(u => u.dpi === dpi)){
        return res.status(400).json({error:'El DPI ya esta registrado'});
    }
    if(users.find(u => u.email === email)){
        return res.status(400).json({error:'El email ya esta registrado'});
    }

    users.push({dpi, nombre, email, password});
    res.status(201).json({message: 'Usuario creado exitosamente'});


})

//listar usuarios

app.get('/users',verificarToken,(req, res) =>{
    let {nombre, email, limit,offset} = req.query;
    let filtrados = users;

    if(nombre){
        filtrados = filtrados.filter(u => u.nombre.toLowerCase().includes(nombre.toLowerCase()));
    }

    if(email){
        filtrados = filtrados.filter(u => u.email === email);
    }

    //paginacion
    limit = parseInt(limit) || filtrados.length;
    offset = parseInt(offset) || 0;
    filtrados = filtrados.slice(offset, offset + limit);

    //no mostrar contraseñas
    const resultado = filtrados.map(({password, ...resto}) => resto);

    if(resultado.length === 0){
        return res.status(404).json({error: 'No se encontraron usuario'});
    }
    res.json(resultado);;

});

//actualizar usuario

app.put('/users/:dpi',verificarToken,( req, res)=>{
    const {dpi} = req.params;
    if(!req.body){
        return res.status(400).json({error: 'No hay datos para actualizar'});       
    }
    
    const {nombre, email, password, nuevoDpi} = req.body;

    const indiceUsuario = users.findIndex(u => u.dpi === dpi);
    if(indiceUsuario === -1){
        return res.status(404).json({error: 'Usuario no encontrado'});
    }

    //validar nuevo DPI se se cambia

    if(nuevoDpi && nuevoDpi !== dpi){
        if(!esDPIValido(nuevoDpi)){
            return res.status(400).json({error:'DPI no es valido'});
        }
        if(users.find(u => u.dpi === nuevoDpi)){
            return res.status(400).json({error:'El DPI ya esta registrado'});
        }
        users[indiceUsuario].dpi = nuevoDpi;
    }

    //validar email si se cambia
    if(email && email !== users[indiceUsuario].email){
        if(!esEmailValido(email)){
            return res.status(400).json({error:'Email no es valido'});
        }
        if(users.find(u => u.email === email)){
            return res.status(400).json({error:'El email ya esta registrado'});
        }
        users[indiceUsuario].email = email;
    }
    if(nombre) users[indiceUsuario].nombre = nombre;
    if(password){
        if(!esPasswordValido(password)){
            return res.status(400).json({error:'Password no es valido'});
        }
        users[indiceUsuario].password = password;
    }
    res.json({message: 'Usuario actualizado exitosamente'});    


});

//eliminar usuario
app.delete('/users/:dpi',verificarToken, (req, res) =>{
    const {dpi} = req.params;
    const indiceUsuario = users.findIndex(u => u.dpi === dpi);
    if(indiceUsuario === -1){
        return res.status(404).json({error: 'Usuario no encontrado'});
    }
    users.splice(indiceUsuario, 1);
    res.json({message: 'Usuario eliminado exitosamente'});
});



