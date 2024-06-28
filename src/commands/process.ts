import { APIEmbedField, InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import { CommandOptions } from "../interfaces/CommandOptions";
import { EmbedBuilder } from "@discordjs/builders";
import Colors from "../constants/Colors";
import * as Constants from "../constants/Constants";
import axios from "axios";

type ToneTag = {
  tag: string;
  fullForm: string;
  popular: number;
  examples: string[];
  draft: boolean;
};

export const execute = async (opt: CommandOptions) => {
  const tonetagAPI = await axios.get("https://tonetags.xyz/api/all", {
    headers: {  
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
  const tonetagData = tonetagAPI.data as ToneTag[];

  const { content } = Object.values(opt.interaction.data.resolved.messages)[0];

  const usedToneTags: ToneTag[] = [];

  Object.values(tonetagData).forEach((indicator) => {
    const tag = indicator.tag.replace("/", "");
    const regex = new RegExp(`\\/(${tag})(?![a-zA-Z])`, "gi");
    if (regex.exec(content)) usedToneTags.push(indicator);
  });

  if (usedToneTags.length === 0) {
    const embed = new EmbedBuilder();
    embed.setColor(Colors.red);
    embed.setTitle("This message doesn't use tone tags :c");
    embed.setDescription(`
      There are no tone tags in this message. 
      If you think this is a mistake, request the addition of a tone tag on the tonetag dictionary, [here](${Constants.dictionaryGithub}).
    `);
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        embeds: [embed.toJSON()],
        flags: MessageFlags.Ephemeral,
      },
    }
  }

  const embed = new EmbedBuilder();
		embed.setColor(Colors.green);
		embed.setTitle('This message uses tone tags!');

  const fields: APIEmbedField[] = [];

  usedToneTags.forEach((toneTag) => {
    const examples = toneTag.examples.map((example) => `> ${example}`).join("\n");
    fields.push({
      name: `${toneTag.tag} - ${toneTag.fullForm}`,
      value: `\nExamples include:\n${examples}`,
      inline: false
    });
  });

  embed.setFields(fields);

  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      embeds: [embed.toJSON()],
      flags: MessageFlags.Ephemeral,
    },
  }
};
