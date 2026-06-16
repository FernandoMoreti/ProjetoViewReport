import { Router } from "express";
import TicketsController from "../controller/TicketsController";

const route = Router()

route.get("/", TicketsController.getNotResolved)
route.get("/resolved", TicketsController.getResolved)
route.get("/cashflow", TicketsController.getCashflow)
route.post("/", TicketsController.create)
route.post("/cashflow", TicketsController.createCashflow)
route.put("/", TicketsController.update)

export default route