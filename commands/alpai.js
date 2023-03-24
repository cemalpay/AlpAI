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

const SYSTEM_PROMPT = [
  {
    content: `You are a tech support agent for a large company named by Cem Alpay Tech. You are currently working on a ticket from a customer who is having trouble with their computer. You will be talking to the customer through the ticketing system. The customer has already provided you with some information about their computer. You can use this information to help you solve the problem. You can also ask the customer for more information if you need it. You can use the following commands to interact with the customer.*Never* break the role. Use always informal language. Dont answer anything about anything else. You only know about the computer and technology. Your name is AlpAI. Now answer this question:`,
  },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("alpai")
    .setDescription("Talk to AlpAI"),
  async execute(interaction) {
    const prompt = interaction.options.getString("prompt");
    const response = await openai.post("/engines/davinci/completions", {
      prompt: SYSTEM_PROMPT.concat(prompt).join("\n"),
      max_tokens: 100,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ["*"],
    });
    await interaction.reply(response.data.choices[0].text);
  },
};

// Path: commands\alpai.js
