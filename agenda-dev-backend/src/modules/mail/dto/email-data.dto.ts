import { MailTo } from './mail-to.dto';

export class EmailData {
  to: MailTo[];
  from_name?: string;
  from_mail?: string;
  message: string;
  subject?: string;
}
