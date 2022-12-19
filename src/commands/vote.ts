import { Discord, Slash } from 'discordx';
import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, CommandInteraction, EmbedBuilder } from 'discord.js';

@Discord()
class Vote {
	@Slash({ name: 'vote', description: 'Vote for the bot on top.gg' })
	async info(interaction: CommandInteraction) {
		const embed = new EmbedBuilder();
		embed.setTitle('Vote');
		embed.setDescription(`Voting for the bot helps it get known, if the bot has helped you, consider voting!`);

		const button = new ButtonBuilder().setLabel('Vote').setStyle(ButtonStyle.Link).setURL('https://top.gg/bot/1049042644107546664');
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

		await interaction.reply({
			components: [row],
			embeds: [embed],
			ephemeral: true
		});
	}
}
