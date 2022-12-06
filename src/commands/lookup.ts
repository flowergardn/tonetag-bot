import { Discord, Slash, SlashChoice, SlashOption } from 'discordx';
import tones from '../Tonetags.json';
import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder } from 'discord.js';
import ToneTag from '../interfaces/ToneTag';

const slashOpts = Object.keys(tones).map((tone) => {
	return {
		name: tone,
		value: tone
	};
});

@Discord()
class LookupToneTag {
	@Slash({ name: 'tonetag', description: 'Look up tone tags' })
	async lookup(
		@SlashChoice(...slashOpts)
		@SlashOption({
			description: 'Tone tag to search up',
			name: 'tone',
			required: true,
			type: ApplicationCommandOptionType.String
		})
		option: string,
		interaction: CommandInteraction
	) {
		const toneInfo: ToneTag = tones[option];
		if (!toneInfo) return;

		const issueUrl = 'https://github.com/astridlol/tonetags/issues/new?title=Add%20example%20for%20%5Btag%5D&body=New%20examples%3A%0A%0A%5Breplace%20this%20with%20your%20examples%5D&labels=enhancement';

		const examples = toneInfo.examples.map((ex) => {
			return `• ${ex}`;
		});

		const embed = new EmbedBuilder();
		embed.setColor('Blurple');
		embed.setTitle(`Information for /${option}`);
		embed.addFields([
			{
				name: `Full-form`,
				value: toneInfo['full-form']
			},
			{
				name: `Description`,
				value: toneInfo.description
			},
			{
				name: `Examples`,
				value: examples.length > 0 ? examples.join('\n') : `No examples found. Do you have an example for this? Add it [here](${issueUrl})!`
			}
		]);

		await interaction.reply({
			embeds: [embed],
			ephemeral: true
		});
	}
}
