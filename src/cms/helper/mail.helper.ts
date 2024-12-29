import * as nodemailer from 'nodemailer';
import * as hbs from 'hbs';
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
            host: process.env.MAIL_HOST, // SMTP host from .env
            port: parseInt(process.env.MAIL_PORT, 10), // SMTP port from .env
            secure: process.env.MAIL_SECURE === 'true', // Use SSL/TLS if MAIL_SECURE is true
            auth: {
                user: process.env.MAIL_USER, // Email username from .env
                pass: process.env.MAIL_PASS, // Email password from .env
            },
        });
    }

    // Helper function to compile the HBS template and send the email
    async sendMailWithTemplate(
        to: string,
        subject: string,
        templateName: string,
        context: object
    ): Promise<void> {
        try {

            // Set the path for HBS templates
            const templatePath = path.join(
                __dirname,
                '..',
                '../template',
                templateName + '.hbs',
            );


            // Compile the HBS template


            const template = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = hbs.compile(template);
            const html = compiledTemplate(context);


            // Send email
            const info = await this.transporter.sendMail({
                from: `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
                to,
                subject,
                html, // The compiled HTML from the HBS template
            });

            console.log('Email sent: %s', info.messageId);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }
}


