import { Router } from "express";
import * as profileWasherCtrl from '../controllers/profileWasher.controller';
import { authJwt } from '../middlewares';
const router = Router();


//Registrar cambios de perfil washer
router.post('/', profileWasherCtrl.createOrUpdateWasherProfile)

//Obtener el peril de washer
router.get('/:userId', profileWasherCtrl.getWasherById)

//Obtener washers cercanos, recibe longitud y latitud en cuerpo (Con GET no se pudo)
router.post('/nearby', profileWasherCtrl.getWasherByLatLong)


export default router;