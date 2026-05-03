import Alert from "./alert.model.js";
import { sendEmailAlert } from "./email.service.js";

export const triggerAlert = async ({ monitorId, incident }) => {
  try {
    const recipient = process.env.ALERT_TO_EMAIL || process.env.ALERT_EMAIL;
    const message = `Monitor DOWN!\nMonitor: ${incident.monitorId}\nFailures: ${incident.failCount}`;

    await sendEmailAlert({
      to: recipient,
      subject: "Website Down Alert",
      text: message,
    });

    await Alert.create({
      monitorId,
      incidentId: incident._id,
      status: "SENT",
      message,
    });

    console.log("Alert sent");
  } catch (err) {
    console.error("Alert failed:", err.message);

    if (err.code) {
      console.error("Alert error code:", err.code);
    }

    await Alert.create({
      monitorId,
      incidentId: incident._id,
      status: "FAILED",
      message: err.message,
    });
  }
};
