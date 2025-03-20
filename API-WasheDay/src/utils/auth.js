import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

/**
 * Genera un token JWT para un usuario.
 * @param {Object} user - El objeto de usuario (debe contener al menos el `_id`).
 * @returns {string} - El token JWT generado.
 */
export const signToken = (user) => {
    // Verificar que el usuario tenga un ID
    if (!user._id) {
        throw new Error("El usuario debe tener un ID para generar el token");
    }

    // Crear el payload del token
    const payload = {
        id: user._id, // Usar el ID del usuario
        email: user.email, // Opcional: incluir el correo electrónico
        roles: user.roles // Opcional: incluir los roles del usuario
    };

    // Generar el token
    const token = jwt.sign(
        payload, // Datos que se incluirán en el token
        process.env.JWT_SECRET, // Clave secreta para firmar el token
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } // Tiempo de expiración del token
    );

    return token;
};