import NotificationRepository from "../repository/NotificationRepository"

class NotificationService {
    async getAll() {
        try {
            const banks = await NotificationRepository.getAll()
            return banks
        } catch (error) {
            throw error
        }
    }

    async create(notifications: any[]) {
        const newNotification = await NotificationRepository.create(notifications)
        return newNotification
    }

    async update(notifications: any[]) {
        try {
            for (let notification of notifications) {
                const { id, bank, date, notificated, received, notReceived, obs, automatication } = notification
                await NotificationRepository.update({ id, bank, date, notificated, received, notReceived, obs, automatication })
            }
            return 200
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async delete(id: number) {
        return await NotificationRepository.delete(id)
    }

}

export default new NotificationService()
