import User from '../models/Users';
import Role from '../models/Roles';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
// Cargar variables de entorno desde el archivo .env
dotenv.config();

const SECRET = process.env.SECRET;

//Crea la función que te ayudará a obtener el token
export const signToken = (user) => {
    if (!SECRET) {
        throw new Error('Falta la variable SECRET en el archivo .env');
    }
    const payload = {
        id: user.id,
    };
    return jwt.sign(payload, SECRET);
}

export const signUp = async (req, res) => {
    try {
        // Extraer datos del cuerpo de la petición
        const { name, lname, age, email, password, roles } = req.body;

        // Verificar que los roles existen y obtener sus IDs
        const foundRoles = await Role.find({ name: { $in: roles } });
        if (foundRoles.length !== roles.length) {
            return res.status(400).json({ message: "Uno o más roles no encontrados" });
        }

        // Crear un nuevo usuario
        const newUser = new User({
            name,
            lname,
            age,
            email,
            password: await User.encryptPassword(password),
            roles: foundRoles.map(role => role._id)
        });

        // Guardar el usuario en la bd
        const saveUser = await newUser.save();

        // Verificar que esten llegando correctamente
        console.log(saveUser);
        res.json({ token: signToken(saveUser) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const signIn = async (req, res) => {
    try {
        // Imprimir el cuerpo de la solicitud
        console.log('Cuerpo de la solicitud:', req.body);

        // Buscar usuario por correo
        const userFound = await User.findOne({ email: req.body.email }).populate("roles");
        if (!userFound) {
            console.error('Usuario no encontrado');
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        // Verificar contraseña
        const matchPassword = await User.comparePassword(req.body.password, userFound.password);
        if (!matchPassword) {
            console.error('Contraseña inválida');
            return res.status(401).json({ token: null, message: "Contraseña inválida" });
        }

        // Generar token
        const token = jwt.sign({ id: userFound.id }, process.env.SECRET, {
            expiresIn: 86400 // 24 horas
        });

        console.log('Inicio de sesión exitoso:', userFound);
        res.json({ token });
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ message: error.message });
    }
}

export const getUserInfo = async (req, res) => {
    try {
        // Obtener el token del header
        const token = req.headers.authorization.split(' ')[1];
        
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.SECRET);
        const user = await User.findById(decoded.id).populate("roles");

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json({
            name: user.name,
            role: user.roles[0].name, // Ajusta según cómo guardes los roles
            email: user.email
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}