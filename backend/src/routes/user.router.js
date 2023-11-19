import * as ctrUser from "../controllers/authentication.controller.js";
import * as ctrImage from "../controllers/images.controller.js";
import { Router } from "express";

const routerUser = Router();

routerUser.post("/register", ctrUser.register);
routerUser.post("/login", ctrUser.login);
routerUser.get('/images', ctrImage.getImages);
routerUser.post('/images', ctrImage.addImage);
routerUser.get("/userImages", ctrImage.getUserImages);

export default routerUser;