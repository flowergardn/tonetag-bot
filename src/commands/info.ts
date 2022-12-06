import { Discord, Slash } from 'discordx';
import { ActionRowBuilder, ApplicationCommandOptionType, bold, ButtonBuilder, ButtonStyle, ClientUser, CommandInteraction, EmbedBuilder } from 'discord.js';
import { client } from '../index';
import tones from '../Tonetags.json';

@Discord()
class Info {
	@Slash({ name: 'info', description: 'Find out more information about the bot' })
	async info(interaction: CommandInteraction) {
		let user: ClientUser;
		if (!client.user) return;
		user = client.user;

		const servers = (await client.guilds.fetch()).size;
		const tags = Object.keys(tones).length;

		const embed = new EmbedBuilder();
		embed.setTitle('Info');
		embed.setDescription(`${user.username} is a bot created by astrid`);
		embed.addFields([
			{
				name: 'Servers',
				value: bold(`${servers}`),
				inline: true
			},
			{
				name: 'Tone tags',
				value: bold(`${tags}`),
				inline: true
			}
		]);

		const button = new ButtonBuilder().setLabel('View on GitHub').setStyle(ButtonStyle.Link).setURL('https://github.com/astridlol/tonetags');
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

		await interaction.reply({
			components: [row],
			embeds: [embed],
			ephemeral: true
		});
	}
}
