import { Router } from "express";
import BankController from "../controller/BankController";

const route = Router()

route.get("/", BankController.getAll)
route.post("/", BankController.create)
route.put("/", BankController.update)

export default route