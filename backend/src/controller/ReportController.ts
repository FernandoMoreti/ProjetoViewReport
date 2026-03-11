import { Request, Response } from 'express';
import ReportService from '../service/ReportService';
import { where } from 'sequelize';

class ReportController {
    async getAll(req: Request, res: Response) {
        try {
            const reports   = ReportService.getAll()
            return res.status(200).json(reports)
        } catch (error) {
            throw error
        }
    }

    async getReportsByDate(req: Request, res: Response) {

        const { bank, date } = req.body;

        try {
            const reports = await ReportService.getReportsByDate(bank, date)
            return res.status(200).json(reports)
        } catch (error) {
            throw error
        }
    }

    async create(req: Request, res: Response) {
        const { bank, reports } = req.body

        if (!bank) {
            console.log("Nenhum Nome de banco foi enviado")
            return 'erro'
        }


        const newReports = await ReportService.create(bank, reports)
        return res.status(200).json(newReports)
    }
}

export default new ReportController()