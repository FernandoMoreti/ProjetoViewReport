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

  const data = utils.sheet_to_json(worksheet, { range: 1 }); // { range: 2 }

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

export function getDaysByWeek(initialDate: string, finalDate: string) {
  const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  let currentDate = new Date(initialDate.replace(/-/g, '\/'));
  const lastDate = new Date(finalDate.replace(/-/g, '\/'));

  const resultado = [];

  let qtnDia15 = 0;
  let qtnDia30 = 0;

  while (currentDate <= lastDate) {
    const dayIndex = currentDate.getDay();
    const dayOfMonth = currentDate.getDate();

    if ((dayIndex == 0 || dayIndex == 6) && (dayOfMonth == 15 || dayOfMonth == 30)) {
      if (dayOfMonth === 15) {
        qtnDia15++;
      } else if (dayOfMonth === 30) {
        qtnDia30++;
      }
    } else if (dayIndex >= 1 && dayIndex <= 5) {
      resultado.push(days[dayIndex]);

      if (dayOfMonth === 15) {
        qtnDia15++;
      } else if (dayOfMonth === 30) {
        qtnDia30++;
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return { resultado, qtnDia15, qtnDia30 }
}
