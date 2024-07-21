import nodemailer from "nodemailer";
import schedule from "node-schedule";

const monthlyRule = new schedule.RecurrenceRule();
monthlyRule.hour = 8;
monthlyRule.date = 1;
monthlyRule.tz = "Asia/Singapore";

const monthlyJob = schedule.scheduleJob(monthlyRule, function(){
    console.log('Perform monthly job')
})

const dailyRule = new schedule.RecurrenceRule();
dailyRule.hour = 8;
dailyRule.tz = "Asia/Singapore";

const dailyJob = schedule.scheduleJob(dailyRule, function(){
    console.log("Perform daily job")
})

const update_session_reminder = new schedule.RecurrenceRule();
update_session_reminder.tz = "Asia/Singapore";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "kyleigh.batz@ethereal.email",
    pass: "fNNZSjYdNprVayT3tM",
  },
});

export async function sendEmail() {
  const info = await transporter.sendMail({
    from: '"Admin" <kyleigh.batz@ethereal.email>',
    to: "brandonng2210@gmail.com",
    subject: "This is test email",
    text: "This is test email generated using NodeMailer",
    html: "<b>Test email</b>",
  });
  console.log("Message sent: %s", info.messageId);
  console.log("Email Link: %s", nodemailer.getTestMessageUrl(info));
}
