import User from "../models/Users";
import Role from "../models/Roles";

// Obtener todos los washers
export const getWashers = async (req, res) => {
    try {
        const washerRole = await Role.findOne({ name: "washer" });
        const washers = await User.find({ roles: { $in: [washerRole._id] } })
        .populate('roles', 'name');
        res.json(washers);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los washers', error: error.message });
    }
}

// Obtener un profesor por su ID
export const getWasherById = async (req, res) => {
    const { washerId } = req.params;
    try {
        const washerRole = await Role.findOne({ name: "washer" });
        const washer = await User.findById(washerId)
            .populate('roles', 'name');
        
        if (!washer || !washer.roles.some(role => role._id.equals(washerRole._id))) {
            return res.status(404).json({ message: 'Washer no encontrado' });
        }

        res.json(washer);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el washer', error: error.message });
    }
};

// Crear un profesor
export const createWasher = async (req, res) => {
    try {
        const { name, lname, email, password, age } = req.body;

        // Buscar el rol de profesor
        const washerRole = await Role.findOne({ name: "washer" });

        // Crear un nuevo profesor
        const newWasher = new User({
            name,
            lname,
            email,
            password: await User.encryptPassword(password),
            age,
            roles: [washerRole._id]
        });

        const savedWasher = await newWasher.save();
        res.status(201).json(savedWasher);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear al washer', error: error.message });
    }
};

// Actualizar un profesor por su ID
export const updateWasherById = async (req, res) => {
    const { washerId } = req.params;
    const { name, lname, age } = req.body;
    try {
        // Buscar el rol de estudiante
        const washerRole = await Role.findOne({ name: "washer" });

        // Actualizar el estudiante con los nuevos datos y división
        const updatedWasher = await User.findByIdAndUpdate(
            washerId,
            { name, lname, age },
            { new: true }
        );

        if (!updatedWasher || !updatedWasher.roles.includes(washerRole._id)) {
            return res.status(404).json({ message: 'Washer no encontrado' });
        }
        
        res.json(updatedWasher);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar el washer', error: error.message });
    }
};

// Eliminar un profesor por su ID
export const deleteWasherById = async (req, res) => {
    const { washerId } = req.params;
    try {
        const washerRole = await Role.findOne({ name: "washer" });
        const washer = await User.findById(washerId);
        if (!washer || !washer.roles.some(role => role._id.equals(washerRole._id))) {
            return res.status(404).json({ message: 'Washer no encontrado' });
        }
        
        await User.findByIdAndDelete(washerId);
        res.json({ message: 'Washer eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el washer', error: error.message });
    }
};