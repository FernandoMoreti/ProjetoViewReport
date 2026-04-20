import BankRepository from "../repository/BankRepository"
import ReportRepository from "../repository/ReportRepository"
import { getCurrentDayOfWeek, findBank } from "../utils/utils"
import { read_excel } from '../utils/utils'
import { PropReport } from "../Types/type"
import { BANCOS_MAIS_LOJAS } from "../config/DePara/DePara"

class ReportService {
    async getAll() {
        try {
            const reports = await ReportRepository.getAll()
            return reports
        } catch (error) {
            throw error
        }
    }

    async getAllByIntervalDate(dateOfReport: string, dateFinal: string) {
        try {
            const reports = await ReportRepository.getAllByIntervalDate(dateOfReport, dateFinal)
            return reports
        } catch (error) {
            throw error
        }
    }

    async getReportsByIntervalDate(bank: string, date: string, dateFinal: string) {
        try {

            const hasBank = await BankRepository.getIdByName(bank)

            if (!hasBank) {
                console.error("Banco invalido")
                return 'error'
            }
            const bankId = hasBank.dataValues.id

            const reports = await ReportRepository.getReportsByIntervalDate(bankId, date, dateFinal)
            return reports
        } catch (error) {
            throw error
        }
    }

    async getAllByDate(dateOfReport: string) {
        try {
            const reports = await ReportRepository.getAllByDate(dateOfReport)
            return reports
        } catch (error) {
            throw error
        }
    }

    async getReportsByDate(bank: string, date: string) {
        try {

            const hasBank = await BankRepository.getIdByName(bank)

            if (!hasBank) {
                console.error("Banco invalido")
                return 'error'
            }
            const bankId = hasBank.dataValues.id

            const reports = await ReportRepository.getReportsByDate(bankId, date)
            return reports
        } catch (error) {
            throw error
        }
    }

    async getAllNotProcessed() {
        try {
            const reports = await ReportRepository.getAllNotProcessed()
            return reports
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async getAllLast30DaysByBank(bank: string) {
        try {
            const hasBank = await BankRepository.getIdByName(bank)

            if (!hasBank) {
                console.error("Banco invalido")
                return 'error'
            }

            const bankId = hasBank.dataValues.id

            const reports = await ReportRepository.getAllLast30DaysByBank(bankId)
            return reports
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async create(bank: string, reports: any[]) {

        const hasBank = await BankRepository.getIdByName(bank)

        if (!hasBank) {
            console.error("Banco invalido")
            return 'error'
        }

        const bankId = hasBank.dataValues.id

        for (let report of reports) {
            report.bankId = bankId
            report.dayOfWeek = getCurrentDayOfWeek(report.dateOfReport)
        }

        const newReport = await ReportRepository.create(reports)
        return newReport
    }

    async update(reports: any[]) {
        try {
            for (let report of reports) {
                const { id, filename, processed, processedAt, received } = report
                await ReportRepository.update({ id, filename, processed, processedAt, received })
            }
            return 200
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async validReport(file: Express.Multer.File) {
        try {
            const df = await read_excel(file.buffer) as PropReport[]

            const grupos = Object.groupBy(df, (item: PropReport) => item.Banco as string);

            const listaWork = grupos['WORKBANK']

            for (let item of listaWork!) {
                const nameBank = item.Arquivo.split("-")[0].trim()
                const bank = findBank(nameBank)

                const destino = bank || 'OUTROS';

                if (!grupos[destino]) {
                    grupos[destino] = [];
                }

                grupos[destino].push(item);
            }

            delete grupos['WORKBANK'];



            for (let banco of BANCOS_MAIS_LOJAS) {
                if (banco === "BMG" && grupos["BMG"]) {
                    for (let i of grupos["BMG"]!) {
                        const sufixoLoja = i.Arquivo.includes("53259") ? "53259" : "34362";
                        const termos = [
                            "_BMG_CARD_ATO_E_DIFERIDO_CONSOLIDADO",
                            "_CARTAO_BENEFICIO_ATO_E_DIFERIDO_CONSOLIDADO",
                            "_CONSIGNADO_ATO_E_DIFERIDO_CONSOLIDADO",
                            "_SAQUE_FGTS_ATO_E_DIFERIDO_CONSOLIDADO",
                            "_SEGURO_ATO_CONSOLIDADO",
                            "_SaldoPagoCard",
                            "SaldoPagoCartaoBeneficio"
                        ];

                        const termoEncontrado = termos.find(termo => i.Arquivo.includes(termo));

                        if (termoEncontrado) {
                            const novaChave = `BMG_${sufixoLoja}${termoEncontrado}`;

                            if (!grupos[novaChave]) {
                                grupos[novaChave] = [];
                            }

                            grupos[novaChave].push(i);
                        }
                    }
                }
                if (banco === "C6 BANK" && grupos["C6 BANK"]) {
                    for (let i of grupos["C6 BANK"]!) {
                        const termos = [
                            "ANALÍTICO COMISSÃO FLAT (AUTOMÁTICO + MANUAL (C+D))",
                            "ANALÍTICO KGIRO - EMITIDOS"
                        ];

                        const termoEncontrado = termos.find(termo => i.Arquivo.includes(termo));

                        if (termoEncontrado) {
                            const novaChave = `C6_${termoEncontrado}`;

                            if (!grupos[novaChave]) {
                                grupos[novaChave] = [];
                            }

                            grupos[novaChave].push(i);
                        }
                    }
                }
                if (banco === "C6" && grupos["C6"]) {
                    for (let i of grupos["C6"]!) {
                        const termos = [
                            "C6 AUTO -COMISSÃO À VISTA - ANALÍTICO",
                            "C6 AUTO ZERADO - COMISSÃO À VISTA - ANALÍTICO",
                            "C6EQUITY"
                        ];

                        const termoEncontrado = termos.find(termo => i.Arquivo.includes(termo));

                        if (termoEncontrado) {
                            const novaChave = `${termoEncontrado}`;

                            if (!grupos[novaChave]) {
                                grupos[novaChave] = [];
                            }

                            grupos[novaChave].push(i);
                        }
                    }
                }
                if (banco === "DAYCOVAL" && grupos["DAYCOVAL"]) {
                    for (let i of grupos["DAYCOVAL"]!) {
                        const termos = [
                            "EXERCITO CARTÃO RELATORIOCOMISSAO",
                            "CARTÃO RELATORIOCOMISSAO",
                            "EXERCITO CONSIGNADO COMISSOES A RECEBER",
                            "CONSIGNADO COMISSOES A RECEBER",
                            "AUTORREGULAÇÃO",
                            "PRESTAMISTA DIAMANTE",
                            "PRESTAMISTA"
                        ];

                        const termoEncontrado = termos.find(termo => i.Arquivo.includes(termo));

                        if (termoEncontrado) {
                            const novaChave = `DAYCOVAL_${termoEncontrado}`;

                            if (!grupos[novaChave]) {
                                grupos[novaChave] = [];
                            }

                            grupos[novaChave].push(i);
                        }
                    }
                }
                if (banco === "FACTA" && grupos["FACTA"]) {
                    for (let i of grupos["FACTA"]!) {
                        const termos = [
                            "WL",
                            "LEV"
                        ];

                        const termoEncontrado = termos.find(termo => i.Arquivo.includes(termo));

                        if (termoEncontrado) {
                            const novaChave = `FACTA_${termoEncontrado}`;

                            if (!grupos[novaChave]) {
                                grupos[novaChave] = [];
                            }

                            grupos[novaChave].push(i);
                        }
                    }
                }
                // VALIDAR COM A BIA
                if (banco === "MERCANTIL" && grupos["MERCANTIL"]) {
                    for (let i of grupos["MERCANTIL"]!) {
                        const termos = [
                            "BMB-DIARIO-COMISSAO-AVISTA",
                            "BMB-DIARIO-COMISSAO-PARCELADO",
                            "MBF-DIARIO-COMISSAO-PARCELADO",
                            "BMB-SEMANAL-PRODUCAO",
                            "BMB-DIARIO-COMISSAO-PARCELADO",
                        ];

                        const termoEncontrado = termos.find(termo => i.Arquivo.includes(termo));

                        if (termoEncontrado) {
                            const novaChave = `MERCANTIL_${termoEncontrado}`;

                            if (!grupos[novaChave]) {
                                grupos[novaChave] = [];
                            }

                            grupos[novaChave].push(i);
                        }
                    }
                }
                if (banco === "NOVOSAQUE" && grupos["NOVOSAQUE"]) {
                    for (let i of grupos["NOVOSAQUE"]!) {
                        const termos = [
                            "NOVOSAQUE CLT",
                            "NOVOSAQUE"
                        ];

                        const termoEncontrado = termos.find(termo => i.Arquivo.includes(termo));

                        if (termoEncontrado) {
                            const novaChave = `NOVOSAQUE_${termoEncontrado}`;

                            if (!grupos[novaChave]) {
                                grupos[novaChave] = [];
                            }

                            grupos[novaChave].push(i);
                        }
                    }
                }
                // VALIDAR COM A YOLANDA
                if (banco === "PAN" && grupos["PAN"]) {
                    for (let i of grupos["PAN"]!) {
                        const termos = [
                            "RELCOMISSAOCARTAO",
                            "RELCOMISSAO",
                            "DEMONSTRATIVO",
                            "PAN LAFY",
                            "",
                        ];

                        const termoEncontrado = termos.find(termo => i.Arquivo.includes(termo));

                        if (termoEncontrado) {
                            const novaChave = `PAN_${termoEncontrado}`;

                            if (!grupos[novaChave]) {
                                grupos[novaChave] = [];
                            }

                            grupos[novaChave].push(i);
                        }
                    }
                }
                if (banco === "QUERO MAIS" && grupos["QUERO MAIS"]) {
                    for (let i of grupos["QUERO MAIS"]!) {
                        const termos = [
                            "QUERO MAIS CARTAO",
                            "QUERO MAIS",
                            "QUERO+_CANCELAMENTO"
                        ];

                        const termoEncontrado = termos.find(termo => i.Arquivo.includes(termo));

                        if (termoEncontrado) {
                            const novaChave = `QUERO MAIS_${termoEncontrado}`;

                            if (!grupos[novaChave]) {
                                grupos[novaChave] = [];
                            }

                            grupos[novaChave].push(i);
                        }
                    }
                }
                if (banco === "SAFRA" && grupos["SAFRA"]) {
                    for (let i of grupos["SAFRA"]!) {
                        const termos = [
                            "CONSULTA COMISSOES - DATA PAGAMENTO - NOVO",
                            "GESTÃO CORBAN - DÉBITOS REALIZADOS",
                            "PLUS - CONSULTA COMISSOES - DATA PAGAMENTO - NOVO",
                            "PLUS - GESTÃO CORBAN - DÉBITOS REALIZADOS"
                        ];

                        const termoEncontrado = termos.find(termo => i.Arquivo.includes(termo));

                        if (termoEncontrado) {
                            const novaChave = `SAFRA_${termoEncontrado}`;

                            if (!grupos[novaChave]) {
                                grupos[novaChave] = [];
                            }

                            grupos[novaChave].push(i);
                        }
                    }
                }
                if (banco === "OLE" && grupos["OLE"]) {
                    for (let i of grupos["OLE"]!) {
                        const termos = [
                            "OLE_FVE",
                            "OLE WL",
                        ];

                        const termoEncontrado = termos.find(termo => i.Arquivo.includes(termo));

                        if (termoEncontrado) {
                            const novaChave = `OLE_${termoEncontrado}`;

                            if (!grupos[novaChave]) {
                                grupos[novaChave] = [];
                            }

                            grupos[novaChave].push(i);
                        }
                    }
                }
                if (banco === "VCTEX" && grupos["VCTEX"]) {
                    for (let i of grupos["VCTEX"]!) {
                        const termos = [
                            "VCTEX NOVA LEV",
                            "VCTEX WL",
                        ];

                        const termoEncontrado = termos.find(termo => i.Arquivo.includes(termo));

                        if (termoEncontrado) {
                            const novaChave = `VCTEX_${termoEncontrado}`;

                            if (!grupos[novaChave]) {
                                grupos[novaChave] = [];
                            }

                            grupos[novaChave].push(i);
                        }
                    }
                }
            }

            console.log(Object.keys(grupos))

            return
        } catch (e) {
            console.error(e)
            return
        }
    }
}

export default new ReportService()
