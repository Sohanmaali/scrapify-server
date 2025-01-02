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
    //     async sendMailWithTemplate(
    //         to: string,
    //         subject: string,
    //         templateName: string,
    //         context: object
    //     ): Promise<void> {
    //         try {


    //             console.log('Context received:', JSON.stringify(context, null, 2));

    //             // Set the path for HBS templates
    //             const templatePath = path.join(
    //                 __dirname,
    //                 '..',
    //                 '../template',
    //                 templateName + '.hbs',
    //             );


    //             // Compile the HBS template


    //             const template = fs.readFileSync(templatePath, 'utf8');
    //             const compiledTemplate = hbs.compile(template);
    //             const html = compiledTemplate({ data:context });

    //             console.log(        "=-=-=-=-=-=-=-==-==",html);


    //         // Send email
    //         const info = await this.transporter.sendMail({
    //             from: `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
    //             to,
    //             subject,
    //             html, // The compiled HTML from the HBS template
    //         });

    //         console.log('Email sent: %s', info.messageId);
    //     } catch(error) {
    //         console.error('Error sending email:', error);
    //     }
    // }

    async sendMailWithTemplate(
        to: string,
        subject: string,
        templateName: string,
        context: object
    ): Promise<void> {
        try {
            const templatePath = path.join(__dirname, '..', '../template', `${templateName}.hbs`);

            if (!fs.existsSync(templatePath)) {
                throw new Error(`Template not found: ${templatePath}`);
            }

            const template = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = hbs.compile(template);

            const data = { ...context }; 
            const html = compiledTemplate({ data });

            const info = await this.transporter.sendMail({
                from: `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
                to,
                subject,
                html,
            });

            console.log('Email sent:', info.messageId);
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}


