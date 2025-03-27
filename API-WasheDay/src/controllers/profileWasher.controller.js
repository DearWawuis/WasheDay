import Washer from "../models/Washer";  

// Obtener un perfil de washer por su ID
export const getWasherById = async (req, res) => {
    const { userId } = req.params;
    try {
        const washerProfile = await Washer.findOne({userId: userId});
        
        if (!washerProfile) {
            return res.status(404).json({ success: false, message: 'Perfil de washer no encontrado' });
        }

        res.json({washerProfile});
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el perfil del washer', error: error.message });
    }
};

// Crear o actualizar un perfil de washer
export const createOrUpdateWasherProfile = async (req, res) => {
    const { name, phone, address, latitude, longitude, userId, openingHours, washerId, services, detergents, status } = req.body;
    
    try {
        // Buscar si ya existe un perfil de washer con  _id
        let washerProfile = await Washer.findOne({ _id: washerId });

        if (washerProfile) {
            // Si existe, actualizamos el perfil
            washerProfile.name = name || washerProfile.name;
            washerProfile.phone = phone || washerProfile.phone;
            washerProfile.address = address || washerProfile.address;
            washerProfile.latitude = latitude || washerProfile.latitude;
            washerProfile.longitude = longitude || washerProfile.longitude;
            washerProfile.openingHours = openingHours || washerProfile.openingHours;
            washerProfile.services = services || washerProfile.services;
            washerProfile.detergents = detergents || washerProfile.detergents;
            washerProfile.status = status || washerProfile.status;

            await washerProfile.save();
            return res.json(washerProfile); 
        } else {
            // Si no existe, creamos uno nuevo
            const newWasherProfile = new Washer({
                name,
                phone,
                address,
                latitude,
                longitude,
                userId,
                openingHours, 
                services,
                detergents,
                status
            });

            await newWasherProfile.save();
            return res.status(201).json(newWasherProfile);  // Retornamos el perfil creado
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al crear o actualizar el perfil de washer', error: error.message });
    }
};

//  Formula para calcular distancia en km entre 2 puntos longitud y latitud
const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio en Km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c;
  };

// Obtener las lavanderías más cercanas por latitud y longitud
export const getWasherByLatLong = async (req, res) => {
    const { latitude, longitude, radius = 3 } = req.body;  // Radio en km por default es 3km
  
    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, message: "Se requiere latitud y longitud" });
    }
  
    try {
      // Obtener todos los perfiles de washer
      const washers = await Washer.find();
  
      // Filtrar lavanderías dentro del radio KM
      const nearbyWashers = washers.filter((washer) => {
        const distance = haversineDistance(latitude, longitude, washer.latitude, washer.longitude);
        return distance <= radius; // Solo agregar las lavanderías dentro del radio
      });
  
      if (nearbyWashers.length === 0) {
        return res.status(404).json({ success: false, message: "No se encontraron lavanderías cercanas" });
      }
  
      // Retornar las lavanderías cercanas
      res.json({ success: true, washers: nearbyWashers });
    } catch (error) {
        console.error(error);
      res.status(500).json({ message: "Error al obtener las lavanderías", error: error.message });
    }
  };