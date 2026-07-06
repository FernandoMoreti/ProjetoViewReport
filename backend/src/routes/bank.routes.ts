import { Router } from "express";
import BankController from "../controller/BankController";

const route = Router()

route.get("/", BankController.getAll)
route.get("/notification", BankController.getAllBankNotification)
route.post("/", BankController.create)
route.post("/notification", BankController.createBankNotification)
route.post("/findBankByName", BankController.getByName)
route.put("/", BankController.update)

export default route