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
            const hoje = new Date();
            const diaDaSemana = hoje.getDay();
            let dataInicioBusca = new Date(hoje);

            if (diaDaSemana === 1) {
                dataInicioBusca.setDate(hoje.getDate() - 3);
            } else if (diaDaSemana === 2) {
                dataInicioBusca.setDate(hoje.getDate() - 1);
            } else {
                const diffParaSegunda = diaDaSemana === 0 ? -6 : 1 - diaDaSemana;
                dataInicioBusca.setDate(hoje.getDate() + diffParaSegunda);
            }

            dataInicioBusca.setHours(0, 0, 0, 0);

            const dataInicio = dataInicioBusca.toISOString().split('T')[0];
            const dataFim = new Date().toISOString().split('T')[0]; // Até hoje

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
                            [Op.between]: [dataInicio, dataFim]
                            }
                        },
                        required: false
                        }
                    ]
                    }
                ]
            });

            return results.map(s => {
            const item = s.get({ plain: true }) as any;

            if (item.bank?.reports) {
                item.bank.reports = item.bank.reports.filter((r: any) => {
                    const diaBate = r.dayOfWeek === item.dayOfWeek;
                    if (!diaBate) return false;

                    if (item.dayOfWeek === 'Sexta' && diaDaSemana === 1) {
                        return true;
                    }

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