export function generateLast30Days() {
  const dates = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates; // Retorna [hoje, ontem, anteontem...]
};

const map: Record<string, string> = {
  "Aki": "AKI CAPITAL",
  "Amigoz": "AMIGOZ",
  "BRB360": "BRB 360",
  "BRBInconta Validar": "BRB INCONTA",
  "BRBRed": "BRB RED",
  "BTW": "BTW",
  // "Bv": "BV",
  "C6Auto": "C6 AUTO",
  "C6bankComissao": "C6 BANK",
  "C6Equity": "C6 CAR EQUITY",
  "C6KGIRO": "KGIRO",
  "Caixa": "CBA - CAIXA",
  "CAPITALCONSIGCancelados": "CAPITAL CONSIG",
  "CAPITALCONSIGComissao": "CAPITAL CONSIG",
  "CAPITALCONSIGSeguro": "CAPITAL CONSIG",
  // "ComissaoZerada": "OUTROS",
  "Crefaz": "CREFAZ",
  "CrefazCLT": "CREFAZ CLT",
  // "CrefisaJN": "CREFISA JN",
  // "CrefisaWL": "CREFISA WL",
  "Digio": "DIGIO",
  "EmpresteiCred": "EMPRESTEI CRED",
  "Euro": "EURO 17",
  "Evol": "EVOL",
  // "Facta": "FACTA",
  "Grandino": "GRANDINO",
  "Happy": "HAPPY",
  "Hope": "HOPE",
  "Icred": "ICRED",
  // "Itau360": "ITAU 360",
  // "ItauConsig": "ITAU CONSIG",
  "Jbcred": "JBCRED",
  "Kardbank": "KARDBANK",
  // "MASTER": "MASTER",
  "MEUCASHCARD": "MEUCASHCARD",
  "NBC": "NBC",
  "NEO": "NEO",
  "NovoSaque": "NOVO SAQUE",
  "NovoSaqueCF": "NOVO SAQUE",
  "NovoSaqueCartao": "NOVO SAQUE",
  "NYC": "NYC",
  "ParanaBank": "PARANÁ BANK",
  "PanWlConsig": "PAN WL",
  "PanWlCartao": "PAN WL",
  "PANLAFY": "PAN LAFY",
  "PHtech": "PH TECH",
  "Presenca": "PRESENÇA BANK",
  "QualiBank": "QUALIBANK",
  // "QUERO CARTÃO": "",
  // "QUERO CONSIG": "",
  "Sabemi": "SABEMI",
  "SafraComissaoZeroCBU": "SAFRA CBU (37)",
  "SafraComissaoZeroCBSU": "SAFRA CBSU (72)",
  "SafraDebitos": "SAFRA CBSU (72)",
  "SantanderFit": "SANTANDER FIT ENERG",
  "SantanderFVEVI": "SANTANDER FVE",
  "OLE_FVE": "SANTANDER OLE",
  "TotalCash": "TOTAL CASH",
  "V8": "V8",
  "VCtexNOVA": "VCTEX NOVA LEV",
  "VCtexWL": "VCTEX WL",
  // "Viacerta": "",
  "WebCash": "WEBCASH",
}

export async function findBank(bank: string): Promise<string> {

  try {
    const getBank: string = map[bank] ?? "Banco não localizado";
    return getBank
  } catch (error) {
    console.error(error)
    return "error"
  }

}

export function extractFilename(disposition: string | null) {
  if (!disposition) return null;
  const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
  return matches && matches[1] ? decodeURIComponent(matches[1].replace(/['"]/g, '')) : null;
}

export const bank_id = {
  "DIGIO": 15, 
  "EMPRESTEI CRED": 16, 
  "EURO 17": 17, 
  "EVOL": 18, 
  "FACTA 92359": 62, 
  "GRANDINO": 19, 
  "HAPPY": 20, 
  "HOPE": 21, 
  "ICRED": 22, 
  "ITAU 360": 24, 
  "ITAU CONSIG": 23, 
  "AKI CAPITAL": 2, 
  "AMIGOZ": 1, 
  "AMIGOZ TEDDY": 3, 
  "BANRISUL": 60, 
  "BMG": 55, 
  "BRB 360": 5, 
  "BRB INCONTA": 6, 
  "BRB RED": 4, 
  "BTW": 9,
  "C6 BANK": 8, 
  "C6 CAR EQUITY": 10, 
  "CAPITAL CONSIG": 11, 
  "CBA - CAIXA": 12, 
  "JBCRED": 25, 
  "KARDBANK": 26, 
  "KGIRO": 53, 
  "MASTER": 27, 
  "MEUCASHCARD": 28, 
  "NEO": 59, 
  "NOVO SAQUE": 29, 
  "NOVO SAQUE CLT": 52, 
  "NYC": 30, 
  "PAN LAFY": 42, 
  "PAN LEV": 40, 
  "PAN PLUS": 41, 
  "PAN WL": 31, 
  "PARANÁ BANK": 32, 
  "PARANÁ BANK - SEGURO": 50, 
  "PH TECH": 33, 
  "PRESENÇA BANK": 34, 
  "QUALIBANK": 35, 
  "QUERO CARTÃO": 47, 
  "QUERO CONSIG": 36, 
  "SABEMI": 37, 
  "SAFRA CBSU (72)": 46, 
  "SAFRA CBU (37)": 38, 
  "SANTANDER FIT ENERG": 58, 
  "SANTANDER FVE": 56, 
  "SANTANDER OLE": 57, 
  "TOO SEGUROS LEV": 54, 
  "TOO SEGUROS WL": 51, 
  "TOTAL CASH": 7, 
  "V8": 44,
  "VCTEX NOVA LEV": 39,
  "VCTEX WL": 43,
  "WEBCASH": 45,
  "DAYCOVAL CARTÃO": 63,
  "DAYCOVAL CONSIG EX": 64,
  "DAYCOVAL CARTÃO EX": 65,
  "FACTA 94569": 66,
  "CREFAZ": 13,
  "CREFAZ CLT": 48,
  "CREFISA JN": 14,
  "CREFISA WL": 49,
  "DAYCOVAL CONSIG": 61,
}