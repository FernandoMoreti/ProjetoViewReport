import { Request, Response } from 'express';
import ProposalService from '../service/ProposalService';
import { createExcel } from '../utils/utils';

class ProposalController {
    async getAll(req: Request, res: Response) {

        const startDate = req.query.startDate as string;
        const finalDate = req.query.finalDate as string;

        if (!startDate || !finalDate) {
            return res.status(400).json({ error: "Datas são obrigatórias" });
        }

        try {
            const proposals = await ProposalService.getAll(startDate, finalDate)

            return res.status(200).json(proposals)
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getExcel(req: Request, res: Response) {

        const startDate = req.query.startDate as string;
        const finalDate = req.query.finalDate as string;

        if (!startDate || !finalDate) {
            return res.status(400).json({ error: "Datas são obrigatórias" });
        }

        try {
            const proposals = await ProposalService.getAll(startDate, finalDate)
            const buffer = await createExcel(proposals)

            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader('Content-Disposition', 'attachment; filename=propostas.xlsx');

            return res.status(200).send(buffer)
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getByBank(req: Request, res: Response) {
        const { bank } = req.body || ""

        if (!bank) {
            console.log("nenhum banco foi enviado")
            res.status(400).json({ "Error": "Não recebemos nenhum banco" })
        }

        const banks = await ProposalService.getByName(bank)
        return res.status(200).json(banks)
    }

    async create(req: Request, res: Response) {
        console.log("ROTAS: Entrei no método Create Proposta")
        const proposals = req.body

        if (!proposals) {
            console.log("Nenhuma proposta foi enviado")
            res.status(400).json({ "Error": "Não recebemos nenhuma propsota" })
        }

        const batchSize = 200;
        let newBank = []
        for (let i = 0; i < proposals.length; i += batchSize) {
            const batch = proposals.slice(i, i + batchSize);
            let proposal = await ProposalService.create(batch)
            newBank.push(proposal)
        }

        return res.status(200).json(newBank)
    }
}

export default new ProposalController()