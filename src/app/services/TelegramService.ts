// src/app/services/TelegramService.ts
import axios from "axios";

const BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.REACT_APP_TELEGRAM_CHAT_ID;

class TelegramService {
  private readonly apiUrl: string;

  constructor() {
    this.apiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  }

  public async sendBooking(input: {
    name: string;
    phone: string;
    branch: string;
    date: string;
    time: string;
    guests: number;
  }): Promise<void> {
    const message =
      `📅 <b>NEW RESERVATION</b>\n\n` +
      `👤 <b>Name:</b> ${input.name}\n` +
      `📞 <b>Phone:</b> ${input.phone}\n` +
      `📍 <b>Branch:</b> ${input.branch}\n` +
      `📆 <b>Date:</b> ${input.date}\n` +
      `🕐 <b>Time:</b> ${input.time}\n` +
      `👥 <b>Guests:</b> ${input.guests}`;

    await this._send(message);
  }

  public async sendContact(input: {
    name: string;
    email: string;
    message: string;
  }): Promise<void> {
    const message =
      `📩 <b>NEW INQUIRY</b>\n\n` +
      `👤 <b>Name:</b> ${input.name}\n` +
      `📧 <b>Email:</b> ${input.email}\n` +
      `💬 <b>Message:</b> ${input.message}`;

    await this._send(message);
  }

  private async _send(text: string): Promise<void> {
    try {
      await axios.post(this.apiUrl, {
        chat_id: CHAT_ID,
        text,
        parse_mode: "HTML",
      });
    } catch (err) {
      console.log("Telegram error:", err);
      throw err;
    }
  }
}

export default TelegramService;
