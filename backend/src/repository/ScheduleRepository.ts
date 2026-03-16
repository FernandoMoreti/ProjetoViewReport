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
    const startOfWeek = new Date();
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Ajusta para Segunda
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0,0,0,0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 4); // Vai até Sexta
    endOfWeek.setHours(23,59,59,999);

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
                    startOfWeek.toISOString().split('T')[0],
                    endOfWeek.toISOString().split('T')[0]
                  ]
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
            item.bank.reports = item.bank.reports.filter(
                (r: any) => r.dayOfWeek === item.dayOfWeek
            );
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