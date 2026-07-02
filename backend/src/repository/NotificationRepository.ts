import { Notification } from "../models"
import { NotificationAtt } from "../Types/type"

export class NotificationRepository {
    async getAll() {
        try {
            return Notification.findAll()
        } catch (error) {
            console.error("Erro no repositório:", error);
            throw error;
        }
    }

    async create(notifications: any[]) {
        try {

            if (!notifications || notifications.length === 0) {
                throw new Error("Nenhum dado fornecido para inserção.");
            }

            const newNotification = await Notification.bulkCreate(notifications)
            return newNotification
        } catch (error) {
            throw error
        }
    }

    async update({ id, bank, date, notificated, received, notReceived, obs, automatication }: NotificationAtt) {
        try {
            const newNotification = await Notification.update({
                bank,
                date,
                notificated,
                received,
                notReceived,
                obs,
                automatication
            }, {
                where: {
                    id: id
                }
            })
            return newNotification
        } catch (error) {
            throw error
        }
    }

    async delete(id: number) {
        try {
            return await Notification.destroy({
                where: {
                    id
                }
            })
        } catch (error) {
            throw error
        }
    }
}

export default new NotificationRepository()