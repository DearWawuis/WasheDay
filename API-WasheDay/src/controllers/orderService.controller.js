import OrderService from "../models/orderService";
import Washer from "../models/Washer";

//Obtener una orden de servicio por su ID
export const getOrderServiceById = async (req, res) => {
    const { orderId } = req.params;  

    try {

        //Ahora consultamos las órdenes de servicio asociadas al washerId
        const orderService = await OrderService.find({_id: orderId})
            .populate('userWashoId', 'name lname email')
            .populate('washerId', 'name services detergents')
            .exec(); 

            if (!orderService) {
                return res.status(404).json({ success: false, message: 'Orden de servicio no encontrada' });
            }

        //Mapear la órden con los servicios y detergentes seleccionados
        const orderFiltered = orderService.map(order => {
            //Buscar el servicio correspondiente usando el 'serviceId' de la orden
            const service = order.washerId.services.find(service => service._id === order.serviceId);
            
            // Filtrar los detergentes seleccionados
            const detergentsName = order.detergents.map(detergentId => {
                const detergent = order.washerId.detergents.find(d => d._id.toString() === detergentId.toString());
                return detergent ? detergent.name : 'Detergente no encontrado';
            });

            //Eliminar los campos 'services' y 'detergents' del objeto washerId ya que hayamos
            //hecho la consulta para no devolver muchos  datos
            const { services, detergents, ...washerData } = order.washerId.toObject();

            return {
                ...order.toObject(),  //Convertir en mongoose a un objeto plano
                serviceName: service ? service.name : 'Servicio no encontrado',  
                //Solo incluir los detergentes seleccionados si hay algo en la lista
                detergentsName: detergentsName.length > 0 ? detergentsName : undefined,
                washerId: washerData,  //Reemplazar washerId con los datos sin 'services' ni 'detergents'
            };
        });

        return res.status(200).json(orderFiltered);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener las órdenes', error });
    }
};


//Crear o actualizar una orden de servicio
export const createOrUpdateOrderService = async (req, res) => {
    const { orderId, washerId, serviceId, userWashoId, detergents, kg, payType, estimatedDeliveryDate, status, rating, comment } = req.body;

    try {
        //Si existe el orderId, actualizamos la orden
        if (orderId) {
            const orderService = await OrderService.findById(orderId);

            if (!orderService) {
                return res.status(404).json({ success: false, message: 'Orden de servicio no encontrada' });
            }

            //Actualizamos los campos de la orden con los valores proporcionados
            orderService.washerId = washerId || orderService.washerId;
            orderService.serviceId = serviceId || orderService.serviceId;
            orderService.washoId = userWashoId || orderService.userWashoId;
            orderService.detergents = detergents || orderService.detergents;
            orderService.kg = kg || orderService.kg;
            orderService.payType = payType || orderService.payType;
            orderService.estimatedDeliveryDate = estimatedDeliveryDate || orderService.estimatedDeliveryDate;
            orderService.status = status || orderService.status;
            orderService.rating = rating || orderService.rating;
            orderService.comment = comment || orderService.comment;

            //Guardamos la orden actualizada
            await orderService.save();
            return res.json({ success: true, orderService });
        } else {
            //Si no existe, creamos una nueva orden de servicio
            const newOrderService = new OrderService({
                washerId,
                serviceId,
                userWashoId,
                detergents,
                kg,
                payType,
                estimatedDeliveryDate,
                status,
                rating,
                comment
            });

            await newOrderService.save();
            return res.status(201).json({ success: true, newOrderService });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error en la peticion!!! Sssh', error: error.message });
    }
};



//OBtener ordenes por Usuario Washo
export const getOrdersByWashoId = async (req, res) => {
    const { userId } = req.params;  

    try {
        const orders = await OrderService.find({ userWashoId: userId })
            .populate('washerId', 'name services detergents')  

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No se encontraron órdenes para este usuario.' });
        }

        //Mapear las órdenes con los servicios y detergentes seleccionados
        const ordersWithDetails = orders.map(order => {
            //Buscar el servicio correspondiente usando el 'serviceId' de la orden
            const service = order.washerId.services.find(service => service._id === order.serviceId);
            
            //Filtrar los detergentes seleccionados
            const detergentsName = order.detergents.map(detergentId => {
                const detergent = order.washerId.detergents.find(d => d._id.toString() === detergentId.toString());
                return detergent ? detergent.name : 'Detergente no encontrado';
            });

            //Eliminar los campos 'services' y 'detergents' del objeto washerId ya que hayamos
            //hecho la consulta para no devolver muchos  datos
            const { services, detergents, ...washerData } = order.washerId.toObject();

            return {
                ...order.toObject(),  //Convertir en mongoose a un objeto plano
                serviceName: service ? service.name : 'Servicio no encontrado',  
                //Solo incluir los detergentes seleccionados si hay algo en la lista
                detergentsName: detergentsName.length > 0 ? detergentsName : undefined,
                washerId: washerData  //Reemplazar washerId con los datos sin 'services' ni 'detergents'
            };
        });

        return res.status(200).json(ordersWithDetails);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener las órdenes', error });
    }
};


//Obetener ordenes por usuario Washer 
export const getOrdersByWasherUserId = async (req, res) => {
    const { userId } = req.params;  

    try {
        //Consultamos el perfil de washer para obtener el washerId
        const washerProfile = await Washer.findOne({ userId });

        if (!washerProfile) {
            return res.status(404).json({ success: false, message: 'No se encontró un perfil de washer con ese userId' });
        }

        const washerId = washerProfile._id;
        console.log(washerId);

        //Ahora consultamos las órdenes de servicio asociadas al washerId
        const orders = await OrderService.find({ washerId })
            .populate('userWashoId', 'name lname email')
            .populate('washerId', 'name services detergents');  

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No se encontraron órdenes para este usuario o lavanderia' });
        }

        //Mapear las órdenes con los servicios y detergentes seleccionados
        const ordersWithDetails = orders.map(order => {
            //Buscar el servicio correspondiente usando el 'serviceId' de la orden
            const service = order.washerId.services.find(service => service._id === order.serviceId);
            
            // Filtrar los detergentes seleccionados
            const detergentsName = order.detergents.map(detergentId => {
                const detergent = order.washerId.detergents.find(d => d._id.toString() === detergentId.toString());
                return detergent ? detergent.name : 'Detergente no encontrado';
            });

            //Eliminar los campos 'services' y 'detergents' del objeto washerId ya que hayamos
            //hecho la consulta para no devolver muchos  datos
            const { services, detergents, ...washerData } = order.washerId.toObject();

            return {
                ...order.toObject(),  //Convertir en mongoose a un objeto plano
                serviceName: service ? service.name : 'Servicio no encontrado',  
                //Solo incluir los detergentes seleccionados si hay algo en la lista
                detergentsName: detergentsName.length > 0 ? detergentsName : undefined,
                washerId: washerData,  //Reemplazar washerId con los datos sin 'services' ni 'detergents'
            };
        });

        return res.status(200).json(ordersWithDetails);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener las órdenes', error });
    }
};



//Obtener detergentes activos de la lavandería
export const getActiveDetergents = async (req, res) => {
    const { washerId } = req.params;

    try {
        //Buscamos el perfil de la lavandería con el washerId
        const washer = await Washer.findById(washerId);

        if(!washer){
            return res.status(404).json({ success: false, message: 'Lavandería no encontrada' });
        }

        //Filtramos los detergentes activos
        const activeDetergents = washer.detergents.filter(detergent => detergent.active === true);

        if(activeDetergents.length === 0){
            return res.status(404).json({ success: false, message: 'No hay detergentes activos' });
        }

        res.json({ success: true, activeDetergents });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los detergentes activos', error: error.message });
    }
};

