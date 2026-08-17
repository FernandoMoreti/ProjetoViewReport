import { Request, Response } from 'express';
import ProposalService from '../service/ProposalService';
import * as ExcelJS from 'exceljs'

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

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=propostas.xlsx');

            const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
                stream: res,
                useStyles: true,
                useSharedStrings: true
            });

            const worksheet = workbook.addWorksheet("Auditoria");

            worksheet.columns = [
                { header: 'Banco', key: 'bank', width: 20},
                { header: 'Proposta', key: 'proposal', width: 20},
                { header: 'Data de pagamento', key: 'date', width: 20},
                { header: 'Tipo de comissão', key: 'typeCommission', width: 20},
                { header: 'Valor Base', key: 'valBase', width: 20},
                { header: 'Valor de comissão', key: 'valCommission', width: 20},
                { header: 'Porcentagem comissão', key: 'pclCommission', width: 20},
                { header: 'Esta duplicada?', key: 'duplicate', width: 20},
            ]

            let page = 1;
            const limit = 5000;
            let hasMore = true;

            while (hasMore) {
                const proposals = await ProposalService.getPaginated(startDate, finalDate, page, limit);

                if (proposals.length > 0) {
                    for (const proposal of proposals) {
                        worksheet.addRow({
                            bank: proposal.bank,
                            proposal: proposal.proposal,
                            date: proposal.date,
                            typeCommission: proposal.typeCommission,
                            valBase: proposal.valBase,
                            valCommission: proposal.valCommission,
                            pclCommission: proposal.pclCommission,
                            duplicate: proposal.duplicate,
                        }).commit();
                    }
                    page++;
                } else {
                    hasMore = false;
                }
            }

            await workbook.commit();
        } catch (error: any) {
            console.error("Erro ao gerar excel por stream:", error);
            if (!res.headersSent) {
                return res.status(500).json({ error: 'Erro ao gerar o arquivo Excel' });
            } else {
                try { res.end(); } catch (e) { /* ignore */ }
            }
        }
    }

    async getByBank(req: Request, res: Response) {
        const { bank } = req.body || {}

        if (!bank) {
            console.log("nenhum banco foi enviado")
            return res.status(400).json({ "Error": "Não recebemos nenhum banco" })
        }

        const banks = await ProposalService.getByName(bank)
        return res.status(200).json(banks)
    }

    async create(req: Request, res: Response) {
        console.log("ROTAS: Entrei no método Create Proposta")
        const proposals = req.body

        if (!proposals || !Array.isArray(proposals) || proposals.length === 0) {
            console.log("Nenhuma proposta foi enviado")
            return res.status(400).json({ "Error": "Não recebemos nenhuma proposta" })
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