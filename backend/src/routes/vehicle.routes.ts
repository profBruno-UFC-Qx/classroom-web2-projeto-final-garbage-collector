import { Router } from "express";
import { VehicleController } from "../controllers/VehicleController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAccountActive } from "../middlewares/ensureAccountActive"; 
import { ensureRole } from "../middlewares/ensureRole"; 
import { validate } from "../middlewares/validateResource";
import { createVehicleSchema } from "../schemas/vehicle.schema";

const router = Router();

router.use(ensureAuthenticated);
router.use(ensureAccountActive);

router.post(
  "/", 
  ensureRole(["motorista"]), 
  validate(createVehicleSchema), 
  VehicleController.create
);

router.get(
  "/", 
  ensureRole(["motorista"]), 
  VehicleController.list
);

router.delete(
  "/:id", 
  ensureRole(["motorista"]), 
  VehicleController.delete
);

export default router;