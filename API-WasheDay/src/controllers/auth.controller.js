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
        const { name, lname, address, email, password, roles } = req.body;

        // Validar que todos los campos requeridos estén presentes
        if (!name || !lname || !address || !email || !password || !roles) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // Verificar si el correo electrónico ya está registrado
        const existingUser = await User.findOne({ email: email.toLowerCase() }); // Convertir a minúsculas para evitar duplicados
        if (existingUser) {
            return res.status(400).json({ message: "El correo electrónico ya está registrado" });
        }

        // Verificar que los roles existen y obtener sus IDs
        const foundRoles = await Role.find({ name: { $in: roles } });
        if (foundRoles.length !== roles.length) {
            return res.status(400).json({ message: "Uno o más roles no encontrados" });
        }

        // Crear un nuevo usuario
        const newUser = new User({
            name,
            lname,
            address,
            email: email.toLowerCase(), // Guardar el correo en minúsculas
            password: await User.encryptPassword(password), // Asegúrate de que esta función esté implementada
            roles: foundRoles.map(role => role._id) // Asignar los IDs de los roles
        });

        // Guardar el usuario en la base de datos
        const savedUser = await newUser.save();

        // Generar un token de autenticación
        const token = signToken(savedUser);

        // Responder con el token
        res.status(201).json({ token });
    } catch (error) {
        if (error.code === 11000) { // Código de error de MongoDB para duplicados
            return res.status(400).json({ message: "El correo electrónico ya está registrado" });
        }
        console.error("Error en signUp:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const signIn = async (req, res) => {
    try {
        // Validar que los campos requeridos estén presentes
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "El correo y la contraseña son obligatorios" });
        }

        // Buscar usuario por correo
        const userFound = await User.findOne({ email: email.toLowerCase() }).populate("roles");
        if (!userFound) {
            console.error('Usuario no encontrado');
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        // Verificar contraseña
        const matchPassword = await User.comparePassword(password, userFound.password);
        if (!matchPassword) {
            console.error('Contraseña inválida');
            return res.status(401).json({ token: null, message: "Contraseña inválida" });
        }

        // Generar token usando la función signToken
        const token = signToken(userFound);

        console.log('Inicio de sesión exitoso:', userFound);
        res.json({ token });
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ message: "Error interno del servidor" });
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
            id: user._id,
            name: user.name,
            role: user.roles[0].name, // Ajusta según cómo guardes los roles
            email: user.email
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}