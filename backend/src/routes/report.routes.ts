import { Router } from "express";
import ReportController from "../controller/ReportController";
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

const route = Router()

route.get("/", ReportController.getAll)
route.get("/30date", ReportController.getAllNotProcessed)
route.post("/30date", ReportController.getAllLast30DaysByBank)
route.post("/", ReportController.create)
route.post("/date", ReportController.getReportsByDate)
route.put("/", ReportController.update)
route.post("/validation", upload.single("file"), ReportController.validReport)
route.get("/validation", ReportController.validReport)
route.delete("/:id", ReportController.delete)

export default route