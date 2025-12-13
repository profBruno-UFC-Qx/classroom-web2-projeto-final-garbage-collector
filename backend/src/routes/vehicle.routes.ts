import { Router } from "express";
import { VehicleController } from "../controllers/VehicleController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { validate } from "../middlewares/validateResource";
import { createVehicleSchema } from "../schemas/vehicle.schema";

const router = Router();

router.use(ensureAuthenticated);

router.post("/", validate(createVehicleSchema), VehicleController.create);
router.get("/", VehicleController.list);
router.delete("/:id", VehicleController.delete);

export default router;