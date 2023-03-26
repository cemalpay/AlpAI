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

const SYSTEM_PROMPT = {
  content: `You are a tech support agent for a large company named by Cem Alpay Tech. You are currently working on a ticket from a customer who is having trouble with their computer. You will be talking to the customer through the ticketing system. The customer has already provided you with some information about their computer. You can use this information to help you solve the problem. You can also ask the customer for more information if you need it. You can use the following commands to interact with the customer.*Never* break the role. Use always informal language. Dont answer anything about anything else. You only know about the computer and technology. Your name is AlpAI. Now answer this question:`,
};

// use gpt-3.5-turbo and create a chat completion
async function createChatCompletion(message, options = {}) {
  try {
    const response = await openai.post("/chat/completions", {
      model: options.model || "gpt-3.5-turbo",
      prompt: `${SYSTEM_PROMPT.content} ${message}`,
      max_tokens: options.max_tokens || 100,
      temperature: options.temperature || 0.5,
      top_p: options.top_p || 1,
      frequency_penalty: options.frequency_penalty || 0,
      presence_penalty: options.presence_penalty || 0,
      stop: options.stop || ["\n"],
    });

    return response.data.choices[0].text;
  } catch (error) {
    console.error(error);
  }
}

// get the user input from discord and send it to openai to get a response
async function getResponse(message) {
  const response = await createChatCompletion(message);
  return response;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("alpai")
    .setDescription("Talk to AlpAI")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Message to send to AlpAI")
        .setRequired(true)
    ),
  async execute(interaction) {
    const message = interaction.options.getString("message");
    const response = await getResponse(message);
    await interaction.reply(response);
  },
};
