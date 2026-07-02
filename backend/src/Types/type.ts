export interface PropReport {
  ID: Number
  Importação: String
  Banco: String
  Arquivo: String
  Tipo: String
  Lidos: Number
  Novos: Number
  Alterados: Number
  Usuário: String
  Processo: String
}

export interface Intervalo {
  min: number;
  max: number;
}

export interface TicketAtt {
    id: number;
    bank: string;
    dateOfTicket: string;
    about: string;
    numTicket: string;
    resolved: boolean;
}

export interface TicketCashflowAttributes {
  id: number;
  idParceiro: number;
  phone: number;
  proposal: string;
  obs: string;
  resolved: boolean;
}

export interface NotificationAtt {
  id: number;
  bank: string;
  date: string;
  notificated: boolean;
  received: boolean;
  obs: string;
  automatication: boolean;
}

export interface UserAttributes {
  username: string;
  password: string;
  role: string
}