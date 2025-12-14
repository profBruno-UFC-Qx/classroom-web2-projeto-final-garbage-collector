import { Router } from "express";
import multer from "multer";
import { UserController } from "../controllers/UserController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { validate, validateFile } from "../middlewares/validateResource"; 
import { updateUserSchema, avatarFileSchema } from "../schemas/user.schema";

const userRoutes = Router();

const upload = multer({ 
  storage: multer.memoryStorage()
});

userRoutes.get(
  "/me", 
  ensureAuthenticated, 
  UserController.me
);

userRoutes.put(
  "/", 
  ensureAuthenticated, 
  validate(updateUserSchema), 
  UserController.update
);

userRoutes.patch(
  "/become-driver", 
  ensureAuthenticated, 
  UserController.becomeDriver
);

userRoutes.patch(
  "/avatar", 
  ensureAuthenticated, 
  upload.single("avatar"), 
  validateFile(avatarFileSchema),
  UserController.updateAvatar
);

export default userRoutes;