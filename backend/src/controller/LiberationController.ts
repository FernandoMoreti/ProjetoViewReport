import { Request, Response } from 'express';
import LiberationService from '../service/LiberationService';

class LiberationController {
    async getAll(req: Request, res: Response) {
        try {
            const liberations = await LiberationService.getAll()
            return res.status(200).json(liberations)
        } catch (error) {
            throw error
        }
    }

    async update(req: Request, res: Response) {
        console.log("ROTAS: Entrei no método Update Liberation")
        const { liberation } = req.body

        const updatedLiberation = await LiberationService.update(liberation)

        if (liberation.resolved == true) {
            await LiberationService.sendToAgent(liberation)
        }

        return res.status(200).json(updatedLiberation)
    }

    async delete(req: Request, res: Response) {
        console.log("ROTAS: Entrei no método Delete Liberation")
        const { id } = req.params

        await LiberationService.delete(id)
        return res.status(200).json({ message: "Excluido com sucesso "})
    }
}

export default new LiberationController()