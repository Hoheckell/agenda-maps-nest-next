import { MailTo } from "./mail-to.interface";

export interface BirthDayMessage {
    to: MailTo[]; 
    from_name?: string;
    from_mail?: string;
    message: string;
    subject?: string;
}
