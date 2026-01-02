import { Router } from "express";
import { AdminController } from "../controllers/AdminController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureRole } from "../middlewares/ensureRole";

const adminRoutes = Router();

adminRoutes.use(ensureAuthenticated, ensureRole(["admin"]));

adminRoutes.get("/users", AdminController.listUsers);
adminRoutes.patch("/users/:id/status", AdminController.toggleUserStatus);

adminRoutes.get("/rides", AdminController.listRides);
adminRoutes.patch("/rides/:id/cancel", AdminController.cancelRide);

export default adminRoutes;