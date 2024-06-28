import { InteractionResponseType, InteractionType, MessageFlags } from "discord-api-types/v10";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { sign } from "tweetnacl";
import Interaction from "./interfaces/Interaction";
import { Buffer } from "node:buffer";

const DISCORD_PUBLIC_KEY = "2ad26166e0e64c0e6938ca3e2dd172edefb5080cd755a6f3bac9fb4ca5bff0ae"

const app = new Hono();

app.get("/", (ctx) => {
  return ctx.text(`
    Welcome to the tonetag bot! 👋

    install: https://top.gg/bot/1049042644107546664
    source: https://github.com/prettyflowerss/tonetag-bot
    donate: https://github.com/sponsors/prettyflowerss

    ~ thanks for reading
  `);
});

app.post("/", async (ctx) => {
  const body = await ctx.req.json();

  const signature = ctx.req.header("x-signature-ed25519");
  const timestamp = ctx.req.header("x-signature-timestamp");

  if (!signature || !timestamp) {
    console.log("Missing signature or timestamp");
    throw new HTTPException(400, {
      message: "Bad request signature.",
    });
  }

  const isVerified = sign.detached.verify(
    Buffer.from(timestamp + JSON.stringify(body)),
    Buffer.from(signature, "hex"),
    Buffer.from(DISCORD_PUBLIC_KEY, "hex")
  );

  if (!isVerified) {
    throw new HTTPException(400, {
      message: "Failed to validate request signature.",
    });
  }

  // ACK ping from Discord
  if (body.type === 1) {
    console.log("Received ping from Discord");
    return ctx.json({
      type: 1,
    });
  }

  if (body.type == InteractionType.ApplicationCommand) {
    console.log("Received interaction from Discord");
    const interaction = body as Interaction;

    try {
      console.log("woah")
      const command = await import(`./commands/process`);
      console.log("woah 2")
      const commandResponse = await command.execute({
        interaction,
        ctx,
      });
      console.log("woah 3", commandResponse)
      // actually returns the response in the req body
      return ctx.json(commandResponse);
    } catch (err: any) {
      console.log(err.message);
      console.log(`command does not exist`);
    }

    return ctx.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: "Um, this is awkward. There's no way for me to handle that command, sorry :c",
        flags: MessageFlags.Ephemeral,
      },
    });
  }

  console.log("Unknown interaction type " + body.type);

  return ctx.json({ hello: "world" });
});

export default app;
