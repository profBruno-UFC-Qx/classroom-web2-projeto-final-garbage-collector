import { Router } from "express";
import { RideController } from "../controllers/RideController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureRole } from "../middlewares/ensureRole"; 
import { validate } from "../middlewares/validateResource";
import { createRideSchema } from "../schemas/ride.schema";

const router = Router();

router.use(ensureAuthenticated);

router.post(
  "/", 
  ensureRole(["motorista"]), 
  validate(createRideSchema), 
  RideController.create
);

export default router;