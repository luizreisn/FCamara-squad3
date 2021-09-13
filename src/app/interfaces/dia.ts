import { Agendamento } from "./agendamento";

export interface Dia {
    id?: string;
    unidade?: string;
    contador?: number;
    agendamentos?: Agendamento[];
}
