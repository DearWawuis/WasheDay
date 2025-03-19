import { Router } from "express";
import * as washosCtrl from '../controllers/washos.controller';
import { authJwt } from '../middlewares';
import ordersRoutes from './orders.routes';

const router = Router();

//Establecer ruta estudiantes mediante GET
router.get('/', washosCtrl.getWashos);
router.get('/:washoId', washosCtrl.getWashoById);
router.post('/', [authJwt.verifyToken, authJwt.isAdmin], washosCtrl.createWasho)
router.put('/:washoId', [authJwt.verifyToken, authJwt.isAdmin], washosCtrl.updateWashoById);
router.delete('/:washoId', [authJwt.verifyToken, authJwt.isAdmin], washosCtrl.deleteWashoById);
//Ruta para pagos con stripe
router.use('/pay', ordersRoutes)
export default router;