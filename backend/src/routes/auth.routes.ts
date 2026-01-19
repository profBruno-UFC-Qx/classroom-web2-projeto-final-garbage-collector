import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { validate } from "../middlewares/validateResource"; 
import { registerSchema, loginSchema } from "../schemas/auth.schema"; 

const router = Router();

router.post("/register", validate(registerSchema), AuthController.register);
router.post("/login", validate(loginSchema), AuthController.login);
router.get("/verify-email", AuthController.verifyEmail);

export default router;