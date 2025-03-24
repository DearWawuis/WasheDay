import { Router } from "express";
import * as ordersCtrl from '../controllers/orders.controller';
const router = Router();


//Genarar nueva orden para pago
router.post('/', ordersCtrl.postItem)

//Obtener el detalle de una orden
router.get('/:id', ordersCtrl.getItem)

//Generar intencion de pago
router.patch('/:id', ordersCtrl.updateItem)

//Confirmar estatus del pago
router.patch('/confirm/:id', ordersCtrl.checkItem)

export default router;