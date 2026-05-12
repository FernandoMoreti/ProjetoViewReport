import { read, utils } from 'xlsx';
import { BANCOS_CONHECIDOS } from '../config/DePara/DePara';

export const getCurrentDayOfWeek = (dateOfReport: string): string => {
  const days = [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado'
  ];

  const date = new Date(dateOfReport).getUTCDay();
  return days[date];
};

export const read_excel = async (buffer: Buffer) => {
  const workbook = read(buffer, { type: 'buffer' });

  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  const data = utils.sheet_to_json(worksheet, { range: 2 }); // { range: 2 }

  return data;
}

export function findBank(textoOriginal: string): string {
  if (!textoOriginal) return "";

  const texto = textoOriginal.toUpperCase().trim();

  for (const [nomePadrao, variacoes] of Object.entries(BANCOS_CONHECIDOS)) {
    const encontrou = variacoes.some(v => texto.includes(v.toUpperCase()));

    if (encontrou) {
      return nomePadrao;
    }
  }

  return "";
}