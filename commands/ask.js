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
    try {
      const answer = await ask(question);
      await interaction.reply(answer);
    } catch (error) {
      console.error(error);
      await interaction.reply(
        "Sorry, I was unable to process your question. Please try again later."
      );
    }
  },
};

async function ask(question) {
  const prompt = `I am AlpAI, a technical support assistant at CAT Limited. I specialize in computer-related technical questions.\nQ: ${question}\nA:`;
  const { data } = await openai.post("/engines/davinci/completions", {
    prompt,
    max_tokens: 150,
    temperature: 0.2,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: ["\n"],
  });
  const answer = data.choices[0].text.trim();

  // Check if the answer is outside of AlpAI's area of expertise
  if (
    answer.includes("I don't know") ||
    answer.includes("I am not sure") ||
    answer.includes("I can't answer")
  ) {
    return "Bilmiyorum, patron bu konu hakkında fikrin var mı? @Cem Alpay";
  }

  return answer;
}
