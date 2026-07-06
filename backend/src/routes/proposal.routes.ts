import { Router } from "express";
import ProposalController from "../controller/ProposalController";

const route = Router()

route.get("/", ProposalController.getAll)
route.post("/", ProposalController.create)
route.post("/findByBank", ProposalController.getByBank)

export default route