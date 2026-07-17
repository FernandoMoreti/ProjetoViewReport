import { LiberationCashflow } from "../models"
import { LiberationAtt } from '../Types/type'

class LiberationRepository {
    async getAll() {
        try {
            const liberations = await LiberationCashflow.findAll({
                where: {
                    resolved: false
                }
            })
            return liberations
        } catch (error) {
            throw error
        }
    }

    async update({ id, agent, obs, resolved }: LiberationAtt) {
        try {
            const newLiberationCashflow = await LiberationCashflow.update({
                agent,
                obs,
                resolved,
            }, {
                where: {
                    id: id
                }
            })
            return newLiberationCashflow
        } catch (error) {
            throw error
        }
    }

    async delete(id: number) {
        try {
            await LiberationCashflow.destroy({
                where: {
                    id: id
                }
            })

            return ''
        } catch (error) {
            throw error
        }
    }
}

export default new LiberationRepository()
