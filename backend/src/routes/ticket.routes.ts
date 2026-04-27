import { Router } from "express";
import TicketsController from "../controller/TicketsController";

const route = Router()

route.get("/", TicketsController.getAll)
route.post("/", TicketsController.create)

export default route