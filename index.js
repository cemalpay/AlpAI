const Discord = require("discord.js");
const axios = require("axios");
const config = require("./config.json");

client.login(config.discord_token);

client.on("ready", () => {
  console.log("Ready!");
});
