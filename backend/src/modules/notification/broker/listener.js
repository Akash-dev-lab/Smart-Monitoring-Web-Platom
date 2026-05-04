import { subscribeToQueue } from "./rabbitmq.broker.js";
import { sendEmail } from "../email.resend.js";

const QUEUE_PREFIX = process.env.QUEUE_PREFIX || "DRISHYA";
const BRAND_NAME = process.env.BRAND_NAME || "Drishya";
const SUPPORT_EMAIL = process.env.BRAND_SUPPORT_EMAIL || "support@drishya.com";

const QUEUES = {
  AUTH_OTP: `${QUEUE_PREFIX}.AUTH.OTP`,
  AUTH_USER_CREATED: `${QUEUE_PREFIX}.AUTH.USER_CREATED`,
  AUTH_USER_LOGGED_IN: `${QUEUE_PREFIX}.AUTH.USER_LOGGED_IN`,
  PAYMENT_COMPLETED: `${QUEUE_PREFIX}.PAYMENT.COMPLETED`,
  PAYMENT_FAILED: `${QUEUE_PREFIX}.PAYMENT.FAILED`,
  PAYMENT_INITIATED: `${QUEUE_PREFIX}.PAYMENT.INITIATED`,
  PRODUCT_CREATED: `${QUEUE_PREFIX}.PRODUCT.CREATED`,
  PRODUCT_UPDATED: `${QUEUE_PREFIX}.PRODUCT.UPDATED`,
  PRODUCT_DELETED: `${QUEUE_PREFIX}.PRODUCT.DELETED`,
  ORDER_CANCELLED: `${QUEUE_PREFIX}.ORDER.CANCELLED`,
};

const buildOtpTemplate = ({ otp, purpose, ttlMinutes }) => {
  const actionMap = {
    register: "Complete your signup",
    registration: "Complete your signup",
    login: "Complete your login",
    forgot: "Reset your password",
    "password reset": "Reset your password",
  };
  const actionText = actionMap[purpose] || "Verify your request";
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
      <h2 style="color: #2c3e50;">${BRAND_NAME} Verification Code</h2>
      <p>${actionText} using the OTP below:</p>
      <div style="font-size: 24px; font-weight: bold; letter-spacing: 4px; margin: 20px 0;">${otp}</div>
      <p>This code expires in <strong>${ttlMinutes} minutes</strong>.</p>
      <p>If you did not request this, please contact ${SUPPORT_EMAIL}.</p>
    </div>
  `;
};

export async function startNotificationListeners() {
  const subscriptions = [];
  const register = (queueName, handler) => {
    subscriptions.push(subscribeToQueue(queueName, handler));
  };

  register(QUEUES.AUTH_OTP, async (data) => {
    const purposeLabel = data.purpose ? ` - ${data.purpose}` : "";
    const subject = `${BRAND_NAME} OTP Verification${purposeLabel}`;
    const text = `Your OTP code is ${data.otp}. It expires in ${data.ttlMinutes} minutes.`;
    const html = buildOtpTemplate({
      otp: data.otp,
      purpose: data.purpose,
      ttlMinutes: data.ttlMinutes,
    });
    await sendEmail(data.email, subject, text, html);
  });

  register(QUEUES.AUTH_USER_CREATED, async (data) => {
    const customerName = `${data.fullName?.firstName || ""} ${data.fullName?.lastName || ""}`.trim();

    const emailHTMLTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
        <h2 style="color: #2c3e50;">Welcome to ${BRAND_NAME} 🚀</h2>

        <p>Hi <strong>${customerName || "there"}</strong>,</p>

        <p>
          We're excited to have you onboard! Your ${BRAND_NAME} account has been
          successfully created.
        </p>

        <p>
          You can now explore the platform and start using all available features.
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

        <p>
          If you ever need help, just reply to this email — we’re here for you.
        </p>

        <p style="margin-top: 30px;">
          Best regards,<br/>
          <strong>The ${BRAND_NAME} Team</strong>
        </p>

        <p style="font-size: 12px; color: #888;">
          This is an automated email confirming your account registration.
        </p>
      </div>
    `;

    await sendEmail(
      data.email,
      `Welcome to ${BRAND_NAME}!`,
      `Your ${BRAND_NAME} account has been created successfully`,
      emailHTMLTemplate
    );
  });

  register(QUEUES.AUTH_USER_LOGGED_IN, async (data) => {
    const customerName = `${data.fullName?.firstName || ""} ${data.fullName?.lastName || ""}`.trim();
    const loginTime = new Date().toLocaleString();

    const emailHTMLTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
        <h2 style="color: #c0392b;">New Login Detected 🔐</h2>

        <p>Hi <strong>${customerName || "there"}</strong>,</p>

        <p>
          We noticed a successful login to your ${BRAND_NAME} account with the
          following details:
        </p>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0;"><strong>Date & Time</strong></td>
            <td style="padding: 8px 0;">${loginTime}</td>
          </tr>
          ${data.ipAddress ? `
          <tr>
            <td style="padding: 8px 0;"><strong>IP Address</strong></td>
            <td style="padding: 8px 0;">${data.ipAddress}</td>
          </tr>` : ""}
          ${data.userAgent ? `
          <tr>
            <td style="padding: 8px 0;"><strong>Device</strong></td>
            <td style="padding: 8px 0;">${data.userAgent}</td>
          </tr>` : ""}
        </table>

        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

        <p>
          <strong>If this was you</strong>, no further action is required.
        </p>

        <p>
          <strong>If this wasn’t you</strong>, please reset your password
          immediately and contact support.
        </p>

        <p style="margin-top: 30px;">
          Stay safe,<br/>
          <strong>The ${BRAND_NAME} Security Team</strong>
        </p>

        <p style="font-size: 12px; color: #888;">
          This security alert was generated automatically.
        </p>
      </div>
    `;

    await sendEmail(
      data.email,
      "Security Alert: New Login Detected",
      `We detected a new login to your ${BRAND_NAME} account`,
      emailHTMLTemplate
    );
  });

  register(QUEUES.PAYMENT_COMPLETED, async (data) => {
    const customerName = `${data.fullName?.firstName || ""} ${data.fullName?.lastName || ""}`.trim();

    const emailHTMLTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
        <h2 style="color: #2c3e50;">Payment Successful 🎉</h2>

        <p>Hi <strong>${customerName || "there"}</strong>,</p>

        <p>
          Thank you for your payment. Your transaction has been completed
          successfully.
        </p>

        <hr style="border: none; border-top: 1px solid #eee;" />

        <h3>Payment Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0;"><strong>Order ID</strong></td>
            <td style="padding: 8px 0;">${data.orderId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Payment ID</strong></td>
            <td style="padding: 8px 0;">${data.paymentId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Amount Paid</strong></td>
            <td style="padding: 8px 0;">
              ${data.currency?.toUpperCase()} ${data.amount}
            </td>
          </tr>
        </table>

        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

        <p>
          If you have any questions, feel free to reply to this email.
        </p>

        <p style="margin-top: 30px;">
          Best regards,<br/>
          <strong>The ${BRAND_NAME} Team</strong>
        </p>

        <p style="font-size: 12px; color: #888;">
          This is an automated payment confirmation.
        </p>
      </div>
    `;

    await sendEmail(
      data.email,
      "Payment Successful",
      `Your payment of ${data.currency?.toUpperCase()} ${data.amount} was successful`,
      emailHTMLTemplate
    );
  });

  register(QUEUES.PAYMENT_FAILED, async (data) => {
    const customerName = `${data.fullName?.firstName || ""} ${data.fullName?.lastName || ""}`.trim();

    const emailHTMLTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
        <h2 style="color: #e74c3c;">Payment Failed ❌</h2>

        <p>Hi <strong>${customerName || "there"}</strong>,</p>

        <p>
          Unfortunately, your payment could not be processed.
        </p>

        <hr style="border: none; border-top: 1px solid #eee;" />

        <h3>Payment Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0;"><strong>Order ID</strong></td>
            <td style="padding: 8px 0;">${data.orderId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Amount</strong></td>
            <td style="padding: 8px 0;">
              ${data.currency?.toUpperCase()} ${data.amount}
            </td>
          </tr>
        </table>

        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

        <p>
          Please try again or contact ${SUPPORT_EMAIL} for assistance.
        </p>

        <p style="margin-top: 30px;">
          Regards,<br/>
          <strong>The ${BRAND_NAME} Team</strong>
        </p>

        <p style="font-size: 12px; color: #888;">
          This is an automated payment failure notification.
        </p>
      </div>
    `;

    await sendEmail(
      data.email,
      "Payment Failed",
      `Your payment of ${data.currency?.toUpperCase()} ${data.amount} failed`,
      emailHTMLTemplate
    );
  });

  register(QUEUES.PAYMENT_INITIATED, async (data) => {
    const customerName = `${data.fullName?.firstName || ""} ${data.fullName?.lastName || ""}`.trim();

    const emailHTMLTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
        <h2 style="color: #f39c12;">Payment Initiated ⏳</h2>

        <p>Hi <strong>${customerName || "there"}</strong>,</p>

        <p>
          Your payment is being processed. We'll notify you once it's complete.
        </p>

        <hr style="border: none; border-top: 1px solid #eee;" />

        <h3>Payment Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0;"><strong>Order ID</strong></td>
            <td style="padding: 8px 0;">${data.orderId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Amount</strong></td>
            <td style="padding: 8px 0;">
              ${data.currency?.toUpperCase()} ${data.amount}
            </td>
          </tr>
        </table>

        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

        <p>
          If you did not initiate this payment, contact ${SUPPORT_EMAIL}.
        </p>

        <p style="margin-top: 30px;">
          Thanks,<br/>
          <strong>The ${BRAND_NAME} Team</strong>
        </p>
      </div>
    `;

    await sendEmail(
      data.email,
      "Payment Initiated",
      `Your payment of ${data.currency?.toUpperCase()} ${data.amount} is being processed`,
      emailHTMLTemplate
    );
  });

  register(QUEUES.PRODUCT_CREATED, async (data) => {
    const emailHTMLTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
        <h2 style="color: #2c3e50;">Product Created ✅</h2>

        <p>The product <strong>${data.productName}</strong> has been created.</p>

        <p style="margin-top: 20px;">
          Regards,<br/>
          <strong>The ${BRAND_NAME} Team</strong>
        </p>
      </div>
    `;

    await sendEmail(
      data.email,
      "Product Created",
      `The product ${data.productName} has been created`,
      emailHTMLTemplate
    );
  });

  register(QUEUES.PRODUCT_UPDATED, async (data) => {
    const emailHTMLTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
        <h2 style="color: #2c3e50;">Product Updated ✅</h2>

        <p>The product <strong>${data.productName}</strong> has been updated.</p>

        <p style="margin-top: 20px;">
          Regards,<br/>
          <strong>The ${BRAND_NAME} Team</strong>
        </p>
      </div>
    `;

    await sendEmail(
      data.email,
      "Product Updated",
      `The product ${data.productName} has been updated`,
      emailHTMLTemplate
    );
  });

  register(QUEUES.PRODUCT_DELETED, async (data) => {
    const emailHTMLTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
        <h2 style="color: #2c3e50;">Product Deleted ✅</h2>

        <p>The product <strong>${data.productName}</strong> has been deleted.</p>

        <p style="margin-top: 20px;">
          Regards,<br/>
          <strong>The ${BRAND_NAME} Team</strong>
        </p>
      </div>
    `;

    await sendEmail(
      data.email,
      "Product Deleted",
      `The product ${data.productName} has been deleted`,
      emailHTMLTemplate
    );
  });

  register(QUEUES.ORDER_CANCELLED, async (data) => {
    const emailHTMLTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
        <h2 style="color: #e74c3c;">Order Cancelled</h2>

        <p>Your order <strong>${data.orderId}</strong> has been cancelled.</p>

        <p style="margin-top: 20px;">
          If you have questions, contact ${SUPPORT_EMAIL}.
        </p>
      </div>
    `;

    await sendEmail(
      data.email,
      "Order Cancelled",
      `Your order ${data.orderId} has been cancelled`,
      emailHTMLTemplate
    );
  });

  return Promise.all(subscriptions);
}
