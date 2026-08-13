// src/app/services/TelegramService.ts
import axios from "axios";
import { serverApi } from "../../lib/config";

// Ilgari bu klass Telegram API'ga to'g'ridan-to'g'ri, bot tokenini
// REACT_APP_ o'zgaruvchisidan o'qib chaqirar edi — CRA bunday o'zgaruvchilarni
// build vaqtida bundle ichiga tekis joylashtiradi, ya'ni token har qanday
// ziyoratchiga ochiq bo'lar edi. Endi backend orqali yuboriladi.
class TelegramService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async sendBooking(input: {
    name: string;
    phone: string;
    branch: string;
    date: string;
    time: string;
    guests: number;
  }): Promise<void> {
    try {
      const url = `${this.path}/contact/booking`;
      await axios.post(url, input);
    } catch (err) {
      console.log("Error, sendBooking:", err);
      throw err;
    }
  }

  public async sendContact(input: {
    name: string;
    email: string;
    message: string;
  }): Promise<void> {
    try {
      const url = `${this.path}/contact/inquiry`;
      await axios.post(url, input);
    } catch (err) {
      console.log("Error, sendContact:", err);
      throw err;
    }
  }
}

export default TelegramService;
