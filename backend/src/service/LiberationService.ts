import LiberationRepository from "../repository/LiberationRepository"
import { LiberationAtt } from '../Types/type'
import axios, {} from "axios"

class LiberationService {
    async getAll() {
        try {
            const reports = await LiberationRepository.getAll()
            return reports
        } catch (error) {
            throw error
        }
    }

    async update(liberation: any) {
        try {

            const { id, agent, obs, resolved, phone } = liberation
            await LiberationRepository.update({ id, agent, obs, resolved, phone })
            return 200

        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async sendToAgent(liberation: LiberationAtt) {

        console.log("Enviando a mensagem para o Whatsapp")

        const uri = `${process.env.URL_BLIP}`

        const header = {
            'Content-Type': 'application/json',
            'Authorization': `${process.env.API_KEY_BLIP_HTTP}`
        }

        const payload = {
            "id": "{{$guid}}",
            "to": `${liberation.phone}@wa.gw.msging.net`,
            "type": "application/json",
            "content": {
                "type": "template",
                "template": {
                "name": "usuarios_notification",
                "language": {
                    "code": "pt_BR",
                    "policy": "deterministic"
                },
                "components": [
                    {
                        "type": "body",
                        "parameters": [
                            {
                            "type": "text",
                            "text": `${liberation.agent}`
                            },
                            {
                            "type": "text",
                            "text": `${liberation.obs}`
                            }
                        ]
                    }
                ]
                }
            }
        }

        try {
            await axios.post(uri, payload, { headers: header })
        } catch (error) {
            console.log(error)
        }
    }

    async delete(id: any) {

        await LiberationRepository.delete(id)

        return ''
    }
}

export default new LiberationService()
