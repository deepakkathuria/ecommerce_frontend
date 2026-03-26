export async function sendInvoiceEmail(order) {
  if (!process.env.SMTP_HOST) return;
  console.log("Invoice email (configure nodemailer/SMTP):", order?.order_id);
}

export async function sendTelegramMessage(order) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    const text = `New order #${order.order_id} — ₹${order.total_amount}`;
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
  } catch (e) {
    console.error("Telegram error:", e?.message);
  }
}
