require("dotenv").config();
const nodemailer = require("nodemailer");

console.log("USER",process.env.EMAIL_USER)
console.log("Password",process.env.EMAIL_PASS)
async function test() {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "SMTP Test",
            text: "If you get this, SMTP is working!"
        });

        console.log("Mail sent!");
    } catch (err) {
        console.log("SMTP ERROR:", err);
    }
}
test();
