import { Router } from "express";
import * as washersCtrl from '../controllers/washers.controller';
import { authJwt } from '../middlewares';

const router = Router();

//Establecer ruta estudiantes mediante GET
router.get('/', washersCtrl.getWashers);
router.get('/:washerId', washersCtrl.getWasherById);
router.post('/', [authJwt.verifyToken, authJwt.isAdmin], washersCtrl.createWasher)
router.put('/:washerId', [authJwt.verifyToken, authJwt.isAdmin], washersCtrl.updateWasherById);
router.delete('/:washerId', [authJwt.verifyToken, authJwt.isAdmin], washersCtrl.deleteWasherById);

export default router;