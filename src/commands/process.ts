import { APIEmbedField, ApplicationCommandType, EmbedBuilder, MessageContextMenuCommandInteraction } from 'discord.js';
import { ContextMenu, Discord } from 'discordx';
import tones from '../Tonetags.json';
import ToneTag from '../interfaces/ToneTag';

@Discord()
class ProcessToneTags {
	@ContextMenu({
		name: 'Process tone tags',
		type: ApplicationCommandType.Message
	})
	async messageHandler(interaction: MessageContextMenuCommandInteraction): Promise<void> {
		const content = interaction.targetMessage.content;

		let usedToneTags: ToneTag[] = [];

		Object.keys(tones).forEach((toneKey) => {
			const regex = new RegExp(`\\/(${toneKey})(?![a-zA-Z])`, 'gi');
			if (regex.exec(content)) usedToneTags.push(tones[toneKey]);
		});

		if (usedToneTags.length === 0) {
			const embed = new EmbedBuilder();
			const issueUrl = 'https://github.com/astridlol/tonetags/issues/new?title=Add%20%5Btag%5D&body=Full%20form%20of%20tag%20%28ex%3A%20sarcastic%29%3A%20%0ADescription%3A%20%0AExample%3A&labels=bug';
			embed.setColor('Red');
			embed.setTitle("This message doesn't use tone tags :c");
			embed.setDescription(`There are no tone tags in this message.\nThink this is a mistake? Open an issue [here](${issueUrl}) on our GitHub`);
			await interaction.reply({
				embeds: [embed],
				ephemeral: true
			});
			return;
		}

		const embed = new EmbedBuilder();
		embed.setColor('Green');
		embed.setTitle('This message uses tone tags!');

		const fields: APIEmbedField[] = [];

		Object.keys(tones).forEach(function (tag) {
			const tagInfo = tones[tag] as ToneTag;

			// regex to see if they exactly match the tone tag.
			// so like, if /srs is in the message, it won't catch that as /s.
			if (!new RegExp(`\\/(${tag})(?![a-zA-Z])`, 'gi').exec(content)) return;

			fields.push({
				name: `${tag} - ${tagInfo['full-form']}`,
				value: tagInfo.description,
				inline: false
			});
		});

		embed.setFields(fields);

		await interaction.reply({
			embeds: [embed],
			ephemeral: true
		});
	}
}
