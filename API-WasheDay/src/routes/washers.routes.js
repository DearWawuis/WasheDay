import { Router } from "express";
import * as washersCtrl from '../controllers/washers.controller';
import { authJwt } from '../middlewares';
import profileWasherRoutes from './profileWasher.routes';

const router = Router();

//Establecer ruta estudiantes mediante GET
router.get('/', washersCtrl.getWashers);
router.get('/:washerId', washersCtrl.getWasherById);
router.post('/', [authJwt.verifyToken, authJwt.isAdmin], washersCtrl.createWasher)
router.put('/:washerId', [authJwt.verifyToken, authJwt.isAdmin], washersCtrl.updateWasherById);
router.delete('/:washerId', [authJwt.verifyToken, authJwt.isAdmin], washersCtrl.deleteWasherById);
//Ruta para el perfil y configuracion de Washer
router.use('/profile', profileWasherRoutes)
export default router;