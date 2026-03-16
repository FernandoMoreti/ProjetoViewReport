import { Router } from "express";
import ScheduleController from "../controller/ScheduleController";

const route = Router()

route.get("/", ScheduleController.getAll)
route.post("/", ScheduleController.create)
route.put("/", ScheduleController.update)
route.delete("/:id", ScheduleController.delete)

export default route