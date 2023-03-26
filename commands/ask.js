// create new command named ask with using chatgpt api from config.json

const axios = require("axios");
const { SlashCommandBuilder } = require("@discordjs/builders");

require("dotenv").config();

const openai = axios.create({
  baseURL: "https://api.openai.com/v1",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  },
});

// take the question from discord and send it to openai api and return the answer to discord
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Ask a question to the bot")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("The question to ask")
        .setRequired(true)
    ),
  async execute(interaction) {
    const question = interaction.options.getString("question");
    const answer = await ask(question);
    await interaction.reply(answer);
  },
};

// async function ask(question) {
//   const prompt = `Q: ${question}\nA:`;
//   const { data } = await openai.post("/engines/davinci/completions", {
//     prompt,
//     max_tokens: 50,
//     temperature: 0.7,
//     top_p: 1,
//     frequency_penalty: 0,
//     presence_penalty: 0,
//     stop: ["\n"],
//   });
//   return data.choices[0].text;
// }

// use gpt-3.5-turbo instead of davinci
async function ask(question) {
  const prompt = `Q: ${question}\nA:`;
  const { data } = await openai.post("/engines/gpt-3.5-turbo/completions", {
    prompt,
    max_tokens: 50,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: ["\n"],
  });
  return data.choices[0].text;
}
