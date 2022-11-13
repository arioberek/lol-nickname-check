import { bot } from "./telegram.js";
import "dotenv/config";
import { regions } from "./regions.js";

const API_URL = "https://lolnames.gg/en";
// const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function getLoLNicknameAvailability(nickname, region) {
  const response = await fetch(`${API_URL}/${region}/${nickname}`);
  const data = await response.text();

  const responseText = data.search(`is available`);

  const isAvailableText = data
    .slice(responseText, responseText + 24)
    .replace(/<[^>]*>/g, "");

  const nicknameIsAvailableText = `${nickname} ${isAvailableText}`;

  console.log(nicknameIsAvailableText);

  return nicknameIsAvailableText;
}

async function sendTelegramMessage() {
  bot.onText(/\/start/, (msg) => {
    bot.sendMessage(
      msg.chat.id,
      "Hello! You can use me to check a League of Legends username availability! Just hit a /check command and I will ask you for a nickname and a region!"
    );
  });

  bot.onText(/\/check/, async (msg) => {
    const chatId = msg.chat.id;

    await bot.sendMessage(
      chatId,
      "Please select your region in the buttons below",
      {
        reply_markup: {
          inline_keyboard: regions,
        },
      }
    );

    bot.on("callback_query", async ({ data: region }) => {
      const { reply_markup } = await bot.sendMessage(
        chatId,
        `Please enter the nickname you want to check in ${region} region`
      );

      if (reply_markup?.includes("/")) {
        return;
      }

      bot.on("message", async (msg) => {
        const nickname = msg.text;

        if (nickname?.includes("/")) {
          return;
        }

        console.log({ nickname, region });

        const nicknameAvailability = await getLoLNicknameAvailability(
          nickname,
          region
        );

        // bot.sendMessage(
        //   "Wait a second, I am checking your nickname availability..."
        // );

        await bot.sendMessage(chatId, nicknameAvailability);
      });
    });
  });
}

async function main() {
  await sendTelegramMessage();
}

main();
