import { Router } from "express";
import ReportController from "../controller/ReportController";

const route = Router()

route.get("/", ReportController.getAll)
route.post("/", ReportController.create)
route.post("/date", ReportController.getReportsByDate)
route.put("/", ReportController.update)

export default route