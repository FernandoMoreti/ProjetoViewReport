import { Router } from "express";
import LiberationController from "../controller/LiberationController";

const route = Router()

route.get("/", LiberationController.getAll)
route.put("/", LiberationController.update)
route.delete("/:id", LiberationController.delete)

export default route