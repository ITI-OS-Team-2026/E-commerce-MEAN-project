const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const loadTemplate = (templateName, variables = {}) => {
  const templatePath = path.join(__dirname, '..', 'templates', templateName);
  let html = fs.readFileSync(templatePath, 'utf-8');

  for (const key in variables)
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), variables[key] || '');

  return html;
};

const sendOrderConfirmationEmail = async (user, order) => {
  // console.log(user);
  const transporter = createTransporter();
  const html = loadTemplate('orderPlaced.html', {
    userName: user.name,
    userEmail: user.email,
    orderId: order._id,
    totalAmount: order.totalAmount,
    itemsCount: order.items.length,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'noreply@yourblog.com',
    to: user.email,
    subject: 'Order Confirmation - Order #' + order._id,
    html,
  });
};

module.exports = { sendOrderConfirmationEmail };
