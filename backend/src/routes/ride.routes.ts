import { Router } from "express";
import { RideController } from "../controllers/RideController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAccountActive } from "../middlewares/ensureAccountActive"; 
import { ensureRole } from "../middlewares/ensureRole"; 
import { validate } from "../middlewares/validateResource";
import { createRideSchema } from "../schemas/ride.schema";

const router = Router();

router.use(ensureAuthenticated);
router.use(ensureAccountActive);

router.get("/", RideController.list); 
router.get("/me", RideController.myRides); 
router.get("/:id", RideController.getById); 

router.post("/:id/request", RideController.requestSeat); 

router.post(
  "/", 
  ensureRole(["motorista"]), 
  validate(createRideSchema), 
  RideController.create
);

router.patch(
  "/:id/cancel",
  ensureRole(["motorista"]),
  RideController.cancel
);

router.patch(
  "/requests/:requestId/handle",
  ensureRole(["motorista"]),
  RideController.handleRequest
);

export default router;