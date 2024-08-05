import nodemailer from "nodemailer";
import schedule from "node-schedule";
import {
  getExpiringTrainings,
  getUpcomingTrainings,
} from "../database/emailDatabase.js";

// For testing
const secondRule = new schedule.RecurrenceRule();
secondRule.second = 0;

const monthlyRule = new schedule.RecurrenceRule();
monthlyRule.hour = 8;
monthlyRule.date = 1;
monthlyRule.tz = "Asia/Singapore";

const monthlyJob = schedule.scheduleJob(monthlyRule, async function () {
  const expiringTrainings = await getExpiringTrainings();
  sendExpiringTrainingEmail(expiringTrainings);
});

const dailyRule = new schedule.RecurrenceRule();
dailyRule.hour = 8;
dailyRule.tz = "Asia/Singapore";

const dailyJob = schedule.scheduleJob(dailyRule, async function () {
  const upcomingTrainings = await getUpcomingTrainings();
  sendUpcomingTrainingsEmail(upcomingTrainings);
});

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

const dateFormatterLong = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  timeZone: "Asia/Singapore",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Singapore",
});

export async function sendExpiringTrainingEmail(expiringTrainings) {
  const now = new Date();
  const formattedDate = dateFormatterLong.format(now);
  const [month, year] = formattedDate.split(" ");

  if (expiringTrainings.length === 0) {
    const info = await transporter.sendMail({
      from: '"Admin" <kyleigh.batz@ethereal.email>',
      to: "hr@example.com, hod@example.com",
      subject: `No Expiring Trainings This Month (${month}, ${year})`,
      text: `There are no trainings expiring this month for ${month} ${year}`,
      html: `<b>There are no trainings expiring this month for ${month} ${year}</b>`,
    });
    console.log("No Expiring Training Message sent: %s", info.messageId);
    console.log("Email Link: %s", nodemailer.getTestMessageUrl(info));
    return "No expiring trainings email sent";
  }

  let textBody = `The following trainings are expiring this month for ${month} ${year}:\n\n`;
  let htmlBody = `<b>The following trainings are expiring this month for ${month} ${year}:</b><br><br>`;

  expiringTrainings.forEach((training, index) => {
    const expiryDateFormatted = dateFormatter.format(
      new Date(training.expiry_date)
    );

    textBody += `${index + 1}. Employee Name: ${
      training.employee_name
    }, Training Title: ${
      training.training_title
    }, Expiry Date: ${expiryDateFormatted}\n\n`;

    htmlBody += `${index + 1}. <b>Employee Name:</b> ${
      training.employee_name
    }, <b>Training Title:</b> ${
      training.training_title
    }, <b>Expiry Date:</b> ${expiryDateFormatted}<br><br>`;
  });

  const info = await transporter.sendMail({
    from: '"Admin" <kyleigh.batz@ethereal.email>',
    to: "hr@example.com, hod@example.com",
    subject: `Expiring Trainings This Month (${month}, ${year})`,
    text: textBody,
    html: htmlBody,
  });

  console.log("Expiring Training Message sent: %s", info.messageId);
  console.log("Email Link: %s", nodemailer.getTestMessageUrl(info));
  return "Expiring trainings email sent";
}

export async function sendUpcomingTrainingsEmail(upcomingTrainings) {
  const now = new Date();
  const formattedDate = dateFormatterLong.format(now);
  const [month, year] = formattedDate.split(" ");

  if(upcomingTrainings.length === 0) {
    return "No Upcoming Trainings";
  }

  const groupedTrainings = upcomingTrainings.reduce((acc, training) => {
    if (!acc[training.employee_email]) {
      acc[training.employee_email] = {
        employee_name: training.employee_name,
        trainings: [],
      };
    }
    acc[training.employee_email].trainings.push(training);
    return acc;
  }, {});

  for (const email in groupedTrainings) {
    const { employee_name, trainings } = groupedTrainings[email];

    let textBody = `Dear ${employee_name},\n\nThe following trainings are upcoming for ${month} ${year}:\n\n`;
    let htmlBody = `<b>Dear ${employee_name},</b><br><br>The following trainings are upcoming for ${month} ${year}:<br><br>`;

    trainings.forEach((training, index) => {
      const startDateFormatted = dateFormatter.format(
        new Date(training.start_date)
      );

      textBody += `${index + 1}. Training Title: ${
        training.training_title
      }, Start Date: ${startDateFormatted}\n\n`;

      htmlBody += `${index + 1}. <b>Training Title:</b> ${
        training.training_title
      }, <b>Start Date:</b> ${startDateFormatted}<br><br>`;
    });

    const info = await transporter.sendMail({
      from: '"Admin" <kyleigh.batz@ethereal.email>',
      to: email,
      subject: `Upcoming Trainings for ${month}, ${year}`,
      text: textBody,
      html: htmlBody,
    });

    console.log(
      `Upcoming Training Message sent to ${email}: %s`,
      info.messageId
    );
    console.log("Email Link: %s", nodemailer.getTestMessageUrl(info));
  }
  return "Upcoming trainings email sent";
}

export async function sendNewTrainings() {}
