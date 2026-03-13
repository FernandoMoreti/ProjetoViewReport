import { Op } from "sequelize"
import { Bank } from "../models"
import { Report } from "../models"

interface ReportAtt {
    id: number
    filename: string
    received: boolean
    processed: boolean
    processedAt: Date
}

class ReportRepository {
    async getAll() {
        try {
            const reports = await Report.findAll({ include: [{model: Bank, as: 'bank'}] })
            return reports
        } catch (error) {
            throw error
        }
    }

    async getAllByDate(dateOfReport: string) {
        try {
            const reports = await Report.findAll(
                {
                    include: [{model: Bank, as: 'bank'}],
                    where: {
                        dateOfReport
                    },
                    order: [
                        [{ model: Bank, as: 'bank' }, 'name', 'ASC']
                    ]
                },
            )
            return reports
        } catch (error) {
            throw error
        }
    }

    async getAllLast30Days() {
        try {

            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            return Report.findAll({
                include: [{model: Bank, as: 'bank'}],
                where: {
                    dateOfReport: {
                        [Op.gte]: thirtyDaysAgo
                    },
                    processed : false
                },
                order: [['dateOfReport', 'DESC']]
            })
        } catch (error) {
            console.error("Erro ao buscar relatórios dos últimos 30 dias:", error);
            throw error;
        }
    }

    async getAllLast30DaysByBank(bankId: number) {
        try {

            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            return Report.findAll({
                include: [{model: Bank, as: 'bank'}],
                where: {
                    dateOfReport: {
                        [Op.gte]: thirtyDaysAgo
                    },
                    bankId
                },
                order: [['dateOfReport', 'DESC']]
            })
        } catch (error) {
            console.error("Erro ao buscar relatórios dos últimos 30 dias:", error);
            throw error;
        }
    }

    async getReportsByDate(bankId: number, date: string) {
        try {
            const reports = await Report.findAll({
                where: {
                    bankId,
                    dateOfReport: date
                }
            })
            return reports
        } catch (error) {
            throw error
        }
    }

    async getReportByNameAndDate(date: string, bankId: number) {
        try {
            const reports = await Report.findOne({
                where: {
                    bankId,
                    dateOfReport: date
                },
            })
            return reports
        } catch (error) {
            throw error
        }
    }

    async create(reports: any[]) {
        try {

            if (!reports || reports.length === 0) {
                throw new Error("Nenhum dado fornecido para inserção.");
            }

            const newReport = await Report.bulkCreate(reports)
            return newReport
        } catch (error) {
            throw error
        }
    }

    async update({ id, filename, processed, processedAt, received }: ReportAtt) {
        try {
            const newReport = await Report.update({
                filename,
                processed,
                processedAt,
                received
            }, {
                where: {
                    id: id
                }
            })
            return newReport
        } catch (error) {
            throw error
        }
    }
}

export default new ReportRepository()
