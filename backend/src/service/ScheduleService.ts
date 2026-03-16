import ScheduleRepository from "../repository/ScheduleRepository"

class ScheduleService {
    async getAll() {
        try {
            const banks = await ScheduleRepository.getAll()
            return banks
        } catch (error) {
            throw error
        }
    }

    async create(bankId: number, dayOfWeek: string, time: string) {
        const newBank = await ScheduleRepository.create(bankId, dayOfWeek, time)
        return newBank
    }

    async update(id: number, bankId: number, dayOfWeek: string, time: string) {
        try {
            await ScheduleRepository.update({ id, bankId, dayOfWeek, time })
            return 200
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async delete(id: number) {
        return await ScheduleRepository.delete(id)
    }

}

export default new ScheduleService()
