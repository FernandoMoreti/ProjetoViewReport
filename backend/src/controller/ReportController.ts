import { Request, Response } from 'express';
import ReportService from '../service/ReportService';

class ReportController {
    async getAll(req: Request, res: Response) {
        try {
            const reports = await ReportService.getAll()
            return res.status(200).json(reports)
        } catch (error) {
            throw error
        }
    }

    async getReportsByDate(req: Request, res: Response) {

        const { bank, date, dateFinal } = req.body;
        let reports;

        try {

            if (dateFinal) {
                if (bank == 'Todos os Bancos') {
                    reports = await ReportService.getAllByIntervalDate(date, dateFinal)
                } else {
                    reports = await ReportService.getReportsByIntervalDate(bank, date, dateFinal)
                }
                return res.status(200).json(reports)
            }
            if (bank == 'Todos os Bancos') {
                reports = await ReportService.getAllByDate(date)
            } else {
                reports = await ReportService.getReportsByDate(bank, date)
            }
            return res.status(200).json(reports)
        } catch (error) {
            throw error
        }
    }

    async getAllNotProcessed(req: Request, res: Response) {
        try {
            const reports = await ReportService.getAllNotProcessed()
            res.status(200).json(reports)
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async getAllLast30DaysByBank(req: Request, res: Response) {
        const { bank } = req.body

        try {
            const reports = await ReportService.getAllLast30DaysByBank(bank)
            res.status(200).json(reports)
        } catch (error) {
            console.error(error)
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

    async update(req: Request, res: Response) {
        const { reports } = req.body

        const newReports = await ReportService.update(reports)
        return res.status(200).json(newReports)
    }

    async validReport(req: Request, res: Response) {

        const file = req.file

        const data = await ReportService.validReport(file!)

        return res.status(200).json(data)
    }
}

export default new ReportController()