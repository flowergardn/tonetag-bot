import { Client } from 'discordx';
import { importx } from '@discordx/importer';

require('dotenv').config();

export const client = new Client({
	intents: ['GuildMessages'],
	silent: true
});

client.on('ready', async () => {
	await client.clearApplicationCommands();
	await client.initApplicationCommands();

	console.log('> Bot online, logged in as: ' + client.user!!.tag);
});

client.on('interactionCreate', (interaction) => {
	client.executeInteraction(interaction);
});

async function start() {
	console.clear();
	await importx(__dirname + '/commands/*.{js,ts}');
	await importx(__dirname + '/events/*.{js,ts}');
	await client.login(process.env.TOKEN!!);
}

start();
