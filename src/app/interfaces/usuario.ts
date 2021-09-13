import { Agendamento } from "./agendamento";

export interface Usuario {
    id?: string;
    nome?: string;
    sobrenome?: string;
    celular?: number;
    cpf?: number;
    email?: string;
    senha?: string;
    agendamentos?: Agendamento[];
}
