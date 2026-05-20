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
  "Caixa": "CBA - CAIXA",
  "CAPITALCONSIGCancelados": "CAPITAL CONSIG",
  "CAPITALCONSIGComissao": "CAPITAL CONSIG",
  "CAPITALCONSIGSeguro": "CAPITAL CONSIG",
  // "ComissaoZerada": "OUTROS",
  // "Crefaz": "CREFAZ",
  // "CrefazCLT": "CREFAZ CLT",
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
  // "KGIRO": "KGIRO",
  // "MASTER": "MASTER",
  "MEUCASHCARD": "MEUCASHCARD",
  // "NBC": "",
  // "NEO": "",
  "NovoSaque": "NOVO SAQUE",
  "NovoSaqueCF": "NOVO SAQUE",
  "NovoSaqueCartao": "NOVO SAQUE",
  "NYC": "NYC",
  "ParanaBank": "PARANÁ BANK",
  "PANLAFY": "PAN LAFY",
  "PHtech": "PH TECH",
  "Presenca": "PRESENÇA BANK",
  "QualiBank": "QUALIBANK",
  // "QUERO CARTÃO": "",
  // "QUERO CONSIG": "",
  // "SABEMI": "",
  "SafraComissaoZeroCBU": "SAFRA CBU (37)",
  "SafraComissaoZeroCBSU": "SAFRA CBSU (72)",
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