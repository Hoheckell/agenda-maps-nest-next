import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { EmailData } from './dto/email-data.dto';
import { EmailResponse } from './dto/email-response.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendBirthdayMessage(data: EmailData): Promise<EmailResponse> {
    const responses = [];
    const errors = [];
    await Promise.all(
      data.to.map(async (e) => {
        await this.mailerService
          .sendMail({
            to: e.email,
            from: data?.from_name
              ? data.from_name + ` <${data.from_mail}>`
              : process.env.MAIL_NAME + ` <${process.env.MAIL_FROM}>`, // override default from
            subject: data?.subject ?? 'Feliz aniversário [Agenda-Dev]',
            template: './aniversario', // `.hbs` extension is appended automatically
            context: {
              // ✏️ filling curly brackets with content
              name: e.name,
              message: data.message,
            },
          })
          .then((response) => {
            responses.push(response);
          })
          .catch((err) => {
            errors.push(err);
          });
      }),
    );
    return { responses, errors };
  }
}
