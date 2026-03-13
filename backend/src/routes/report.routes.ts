import { Router } from "express";
import ReportController from "../controller/ReportController";

const route = Router()

route.get("/", ReportController.getAll)
route.get("/30date", ReportController.getAllLast30Days)
route.post("/30date", ReportController.getAllLast30DaysByBank)
route.post("/", ReportController.create)
route.post("/date", ReportController.getReportsByDate)
route.put("/", ReportController.update)

export default route