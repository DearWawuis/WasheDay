import { Router } from "express";
import * as orderServiceCtrl from '../controllers/orderService.controller';
import { authJwt } from '../middlewares';

const router = Router();

//Ruta para obtener una orden de servicio por Id  **se protege despues
router.get('/getById/:orderId', orderServiceCtrl.getOrderServiceById);

//Ruta para obtener servicios por userId o washoId  **se protege despues
router.get('/getByWashoId/:userId', orderServiceCtrl.getOrdersByWashoId);

//Ruta para obtener servicios por userId (que tendra que hacer consulta en Washer para obtener id)  **se protege despues
router.get('/getByWasherId/:userId', orderServiceCtrl.getOrdersByWasherUserId);

//Ruta para obtener servicios por userId (que tendra que hacer consulta en Washer para obtener id)  **se protege despues
router.get('/getDetergentsByWasherId/:washerId', orderServiceCtrl.getActiveDetergents);

//Ruta para crear o modificar Servicio  **se protege despues
router.post('/', orderServiceCtrl.createOrUpdateOrderService);

export default router;