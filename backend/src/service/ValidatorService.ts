import { PropReport, Intervalo } from "../Types/type";
import { getDaysByWeek, read_excel } from "../utils/utils";
import { banks, times_for_day } from "../config/DePara/DePara";

class ValidatorService {
    async mapperUpload (file: Express.Multer.File, filePaste: Express.Multer.File, initialDate: string, finalDate: string) {
        try {

            const listDaysOfWeek = getDaysByWeek(initialDate, finalDate);

            const df = await read_excel(file.buffer) as PropReport[]
            const dfPaste = await read_excel(file.buffer) as PropReport[]
            const grupos = Object.groupBy(df, (item: PropReport) => item.Banco as string);

            const reportsWorkbank = grupos["WORKBANK"]

            for (let report of reportsWorkbank!) {
                let valorLocalizado = banks.find(bank => report.Arquivo.includes(bank))

                if (valorLocalizado == "BRB_LOJA_LHAMAS") {
                    valorLocalizado = "BRBINCONTA"
                }

                if (valorLocalizado) {
                    if (!grupos[valorLocalizado]) {      
                            grupos[valorLocalizado] = []
                            grupos[valorLocalizado]!.push(report)
                    } else {
                        grupos[valorLocalizado]!.push(report)
                    }
                } else {
                    if (!grupos["OUTROS"]) {
                        grupos["OUTROS"] = []
                        grupos["OUTROS"].push(report)
                    } else {
                        grupos["OUTROS"].push(report)
                    }
                }
            }

            let maxExpected: number = 0
            let minExpected: number = 0
            let min: number
            let max: number
            let expectedByBank: { [banco: string]: Intervalo[] } = {};

            for (let day of listDaysOfWeek.resultado) {
                for (let bank of Object.keys(times_for_day)) {

                    
                    const dataBank = (times_for_day as any)[bank];
                    
                    const value = dataBank[day];

                    if (typeof value === 'string') {
                        if (value === "Manual") {
                            min = 0
                            max = 0
                        } else {
                            const parts = value.split(" ");
                            if (parts.length > 2) {
                                if (parts[0] == "dia") {
                                    min = 0
                                    max = 0
                                } else {
                                    min = Number(parts[1]) || 0;
                                    max = Number(parts[3]) || 0;
                                }
                            } else {
                                min = Number(parts[1]) || 0;
                                max = Number(parts[1]) || 0;
                            }
                        }
                    } else {
                        min = value
                        max = value
                    }
                    
                    minExpected += min
                    maxExpected += max

                    if (!expectedByBank[bank]) {
                        expectedByBank[bank] = []
                        expectedByBank[bank].push({
                            min: min,
                            max: max
                        })
                    } else {
                        expectedByBank[bank].push({
                            min: min,
                            max: max
                        })
                    }
                }
            }

            minExpected += listDaysOfWeek.qtnDia15
            minExpected += listDaysOfWeek.qtnDia30
            maxExpected += listDaysOfWeek.qtnDia15
            maxExpected += listDaysOfWeek.qtnDia30

            return { grupos, minExpected, maxExpected, expectedByBank }
            
        } catch (e) {
            console.error(e)
        }
    }
}

export default new ValidatorService();