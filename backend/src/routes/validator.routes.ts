import express from 'express'
import multer from 'multer';
import ValidatorController from '../controller/ValidatorController';
const upload = multer({ storage: multer.memoryStorage() });

const route = express.Router()

route.post("/", upload.single("file"), ValidatorController.mapperUpload)
route.get("/", () => console.log(""))

export default route