import User from "../models/Users";
import Role from "../models/Roles";

// Obtener todos los estudiantes
export const getWashos = async (req, res) => {
    try {
        const washoRole = await Role.findOne({ name: "washo" });
        const washos = await User.find({ roles: { $in: [washoRole._id] } })
        .populate('roles', 'name');
        res.json(washos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los washos', error: error.message });
    }
}

// Obtener un estudiante por su ID
export const getWashoById = async (req, res) => {
    const { washoId } = req.params;
    try {
        const washoRole = await Role.findOne({ name: "washo" });
        const washo = await User.findById(washoId)
            .populate('roles', 'name');
        
        if (!washo || !washo.roles.some(role => role._id.equals(washoRole._id))) {
            return res.status(404).json({ message: 'Washo no encontrado' });
        }

        res.json(washo);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el washo', error: error.message });
    }
};

// Crear un estudiante
export const createWasho = async (req, res) => {
    try {
        const { name, lname, email, password, age } = req.body;

        // Buscar el rol de estudiante
        const washoRole = await Role.findOne({ name: "washo" });

        // Crear un nuevo estudiante
        const newWasho = new User({
            name,
            lname,
            email,
            password: await User.encryptPassword(password),
            age,
            roles: [washoRole._id]
        });

        const savedWasho = await newWasho.save();
        res.status(201).json(savedWasho);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el washo', error: error.message });
    }
};

// Actualizar un estudiante por su ID
export const updateWashoById = async (req, res) => {
    const { washoId } = req.params;
    const { name, lname, age } = req.body;
    try {
        // Buscar el rol de estudiante
        const washoRole = await Role.findOne({ name: "washo" });

        // Actualizar el estudiante con los nuevos datos y división
        const updatedWasho = await User.findByIdAndUpdate(
            washoId,
            { name, lname, age },
            { new: true }
        );

        if (!updatedWasho || !updatedWasho.roles.includes(washoRole._id)) {
            return res.status(404).json({ message: 'Washo no encontrado' });
        }
        
        res.json(updatedWasho);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar el washo', error: error.message });
    }
};

// Eliminar un estudiante por su ID
export const deleteWashoById = async (req, res) => {
    const { washoId } = req.params;
    try {
        const washoRole = await Role.findOne({ name: "washo" });
        const washo = await User.findById(washoId);
        if (!washo || !washo.roles.some(role => role._id.equals(washoRole._id))) {
            return res.status(404).json({ message: 'Washo no encontrado' });
        }
        
        await User.findByIdAndDelete(washoId);
        res.json({ message: 'Washo eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el washo', error: error.message });
    }
};
