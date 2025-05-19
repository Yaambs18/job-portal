export default {
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT, 465),
  secure: process.env.MAIL_SECURE === 'true',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
};
