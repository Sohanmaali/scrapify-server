
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as path from 'path';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class MailHelper {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: parseInt(process.env.MAIL_PORT, 10),
            secure: process.env.MAIL_SECURE === 'true',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

    }

    async sendMail(
        to: string,
        subject: string,
        templateName: string,
        context: any
    ): Promise<void> {
        try {
            const templatePath = path.join(__dirname, '..', '../template', `${templateName}.hbs`);

            if (!fs.existsSync(templatePath)) {
                throw new Error(`Template not found: ${templatePath}`);
            }

            const template = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars.compile(template);

            context.Year = new Date().getFullYear();
            context.AppLogo = process.env.APP_LOGO || 'AppLogo'
            context.AppName = process.env.APP_NAME || 'AppName'
            context.AdminEmail = process.env.ADMIN_EMAIL || 'AdminEmail'
            context.AppUrl = process.env.APP_URL || 'App_Url'
            const html = compiledTemplate({ data: context });

            const info = await this.transporter.sendMail({
                from: `"${process.env.SENDER_NAME}" ${process.env.SENDER_EMAIL}`,
                to,
                subject,
                html,
            });

            console.log('Email sent:', info.messageId);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }
}
