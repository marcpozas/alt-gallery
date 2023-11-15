import * as ctrUser from "../controllers/authentication.controller.js";
import * as ctrUser from "../controllers/images.controller.js";
import { Router } from "express";

const routerUser = Router();

routerUser.post("/register", ctrUser.register);
routerUser.post("/login", ctrUser.login);
router.get('/images', imageController.getImages);


export default routerUser;