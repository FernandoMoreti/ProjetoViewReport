import { Router } from "express";
import NotificationController from "../controller/NotificationController";

const route = Router()

route.get("/", NotificationController.getAll)
route.post("/", NotificationController.create)
route.put("/", NotificationController.update)
route.delete("/:id", NotificationController.delete)

export default route