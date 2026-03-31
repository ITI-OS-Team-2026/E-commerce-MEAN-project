const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  loadTemplate(templateName, variables = {}) {
    const templatePath = path.join(__dirname, '..', 'templates', templateName);
    let html = fs.readFileSync(templatePath, 'utf-8');

    for (const key in variables) {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), variables[key] || '');
    }

    return html;
  }

  async sendEmail({ to, subject, template, variables = {} }) {
    const html = this.loadTemplate(template, variables);

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@yourblog.com',
      to,
      subject,
      html,
    });
  }
}

module.exports = new EmailService();
