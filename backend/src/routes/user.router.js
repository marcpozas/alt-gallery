import * as ctrUser from "../controllers/authentication.controller.js";
import { Router } from "express";

const routerUser = Router();

routerUser.post("/register", ctrUser.register);
routerUser.post("/login", ctrUser.login);

export default routerUser;