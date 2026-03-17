import { col, Op, Sequelize } from "sequelize"
import { Bank, Report, Schedule } from "../models"

interface ScheduleAtt {
    id: number
    bankId: number
    dayOfWeek: string
    time: string
    bank?: {
        id: number
        name: string
        reports?: any[]
    }
}

export class ScheduleRepository {
    async getAll() {
        try {
            const startOfLastWeek = new Date();
            const day = startOfLastWeek.getDay();
            const diff = startOfLastWeek.getDate() - day + (day === 0 ? -6 : 1) - 7; // -7 dias (Semana Passada)
            startOfLastWeek.setDate(diff);
            startOfLastWeek.setHours(0,0,0,0);

            const endOfCurrentWeek = new Date();
            const dayEnd = endOfCurrentWeek.getDay();
            const diffEnd = endOfCurrentWeek.getDate() - dayEnd + (dayEnd === 0 ? 0 : 7); // Domingo da semana atual
            endOfCurrentWeek.setDate(diffEnd);
            endOfCurrentWeek.setHours(23,59,59,999);

            const results = await Schedule.findAll({
                include: [
                    {
                    model: Bank,
                    as: 'bank',
                    include: [
                        {
                        model: Report,
                        as: 'reports',
                        where: {
                            dateOfReport : {
                            [Op.between]: [
                                startOfLastWeek.toISOString().split('T')[0],
                                endOfCurrentWeek.toISOString().split('T')[0]
                            ]
                            }
                        },
                        required: false
                        }
                    ]
                    }
                ]
            });

            const hoje = new Date();
            const diaDaSemanaAtual = hoje.getDay();
            return results.map(s => {
                const item = s.get({ plain: true }) as any;
                if (item.bank?.reports) {
                    item.bank.reports = item.bank.reports.filter((r: any) => {
                        const diaBate = r.dayOfWeek === item.dayOfWeek;
                        if (!diaBate) return false;

                        if (item.dayOfWeek === 'Sexta' && diaDaSemanaAtual === 1) {
                            return true;
                        }

                        const inicioSemanaAtual = new Date();
                        const d = inicioSemanaAtual.getDay();
                        inicioSemanaAtual.setDate(inicioSemanaAtual.getDate() - d + (d === 0 ? -6 : 1));
                        inicioSemanaAtual.setHours(0,0,0,0);

                        return true;
                    });
                }
                return item;
            });

        } catch (error) {
            console.error("Erro no repositório:", error);
            throw error;
        }
    }

    async create(bankId: number, dayOfWeek: string, time: string ) {
        try {
            const newSchedule = await Schedule.create({
                bankId,
                dayOfWeek,
                time })
            return newSchedule
        } catch (error) {
            throw error
        }
    }

    async update({ id, bankId, dayOfWeek, time }: ScheduleAtt) {
        try {
            const newSchedule = await Schedule.update({
                bankId,
                dayOfWeek,
                time
            }, {
                where: {
                    id: id
                }
            })
            return newSchedule
        } catch (error) {
            throw error
        }
    }

    async delete(id: number) {
        try {
            return await Schedule.destroy({
                where: {
                    id
                }
            })
        } catch (error) {
            throw error
        }
    }
}

export default new ScheduleRepository()