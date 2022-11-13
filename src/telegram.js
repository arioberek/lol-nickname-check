import TelegramBot from "node-telegram-bot-api";
import "dotenv/config";

const token = process.env.TELEGRAM_BOT_TOKEN;

export const bot = new TelegramBot(token, { polling: true });
