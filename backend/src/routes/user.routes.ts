import { Router } from "express";
import multer from "multer";
import { UserController } from "../controllers/UserController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAccountActive } from "../middlewares/ensureAccountActive"; 
import { validate, validateFile } from "../middlewares/validateResource"; 
import { updateUserSchema, avatarFileSchema } from "../schemas/user.schema";

const router = Router();

const upload = multer({ 
  storage: multer.memoryStorage()
});

router.use(ensureAuthenticated);
router.use(ensureAccountActive);

router.get(
  "/me", 
  UserController.me
);

router.put(
  "/",  
  validate(updateUserSchema), 
  UserController.update
);

router.patch(
  "/become-driver",  
  UserController.becomeDriver
);

router.patch(
  "/avatar",  
  upload.single("avatar"), 
  validateFile(avatarFileSchema),
  UserController.updateAvatar
);

export default router;