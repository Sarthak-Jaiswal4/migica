import QRCode from "qrcode";

type WhatsAppPayment = {
  phone: string;
  customerName: string;
  orderReference: string;
  amount: number;
  paymentToken: string;
  upiUrl: string;
};

function requiredConfig() {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const templateName = process.env.WHATSAPP_PAYMENT_TEMPLATE_NAME;
  if (!accessToken || !phoneNumberId || !templateName) return null;
  return { accessToken, phoneNumberId, templateName };
}

export async function sendWhatsAppPayment({ phone, customerName, orderReference, amount, paymentToken, upiUrl }: WhatsAppPayment) {
  const config = requiredConfig();
  if (!config) return { sent: false, configured: false };

  const graphUrl = `https://graph.facebook.com/v25.0/${config.phoneNumberId}`;
  const qrPng = await QRCode.toBuffer(upiUrl, { type: "png", width: 720, margin: 2 });
  const media = new FormData();
  media.append("messaging_product", "whatsapp");
  media.append("file", new Blob([new Uint8Array(qrPng)], { type: "image/png" }), `${orderReference}-payment-qr.png`);

  const mediaResponse = await fetch(`${graphUrl}/media`, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.accessToken}` },
    body: media,
  });
  if (!mediaResponse.ok) throw new Error(`WhatsApp QR upload failed: ${await mediaResponse.text()}`);
  const mediaData = await mediaResponse.json() as { id?: string };
  if (!mediaData.id) throw new Error("WhatsApp did not return a QR media ID");

  const destination = phone.replace(/\D/g, "");
  const messageResponse = await fetch(`${graphUrl}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: destination,
      type: "template",
      template: {
        name: config.templateName,
        language: { code: process.env.WHATSAPP_TEMPLATE_LANGUAGE || "en_US" },
        components: [
          { type: "header", parameters: [{ type: "image", image: { id: mediaData.id } }] },
          {
            type: "body",
            parameters: [
              { type: "text", text: customerName || "Customer" },
              { type: "text", text: orderReference },
              { type: "text", text: `₹${amount.toFixed(2)}` },
            ],
          },
          {
            type: "button",
            sub_type: "url",
            index: "0",
            parameters: [{ type: "text", text: paymentToken }],
          },
        ],
      },
    }),
  });
  if (!messageResponse.ok) throw new Error(`WhatsApp message failed: ${await messageResponse.text()}`);
  return { sent: true, configured: true };
}
