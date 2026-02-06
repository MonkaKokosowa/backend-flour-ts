import express, { RequestHandler } from "express";
import dotenv from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";

dotenv.config();

const app = express();
const port = 3000;

const client = new Client({ intents: [GatewayIntentBits.DirectMessages] });

client.login(process.env.DISCORD_TOKEN);

app.use(express.json());

const mailer: RequestHandler<
  unknown,
  unknown,
  { name: string; email: string; message: string }
> = async (req, res) => {
  const { name, email, message } = req.body;
  try {
    if (message.length > 500 || email.length > 80 || name.length > 40) {
      throw new Error("You're taking too long");
    }

    // DM the mail via discord
    const user = await client.users.fetch("1231629740671111311");
    await user.send(`Name: ${name}\nEmail: ${email}\nMessage: ${message}`);
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to send email");
  }
};

app.post("/mail", mailer);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
