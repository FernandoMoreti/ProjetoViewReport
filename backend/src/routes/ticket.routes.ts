import { Router } from "express";
import TicketsController from "../controller/TicketsController";

const route = Router()

route.get("/", TicketsController.getNotResolved)
route.get("/resolved", TicketsController.getResolved)
route.post("/", TicketsController.create)
route.put("/", TicketsController.update)

export default route