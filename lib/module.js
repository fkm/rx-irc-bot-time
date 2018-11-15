// NPM Dependencies
const { filter } = require('rxjs/operators');
const moment = require('moment');

let defaults = {
	logLevel: 'error'
};

class Module {
	constructor(client, options) {

		this.settings = { ...defaults, ...options };

		//  ____  _
		// / ___|| |_ _ __ ___  __ _ _ __ ___  ___
		// \___ \| __| '__/ _ \/ _` | '_ ` _ \/ __|
		//  ___) | |_| | |  __/ (_| | | | | | \__ \
		// |____/ \__|_|  \___|\__,_|_| |_| |_|___/
		//

		let time$ = client.raw$.pipe(
			filter(message => {
				return !this.settings.channel ||
				       message.args[0] === this.settings.channel ||
				       message.args[1] === this.settings.channel;
			}),
			filter(message => message.command === 'PRIVMSG'),
			filter(message => message.args[1].startsWith('!time'))
		);

		//  ____        _                   _       _   _
		// / ___| _   _| |__  ___  ___ _ __(_)_ __ | |_(_) ___  _ __  ___
		// \___ \| | | | '_ \/ __|/ __| '__| | '_ \| __| |/ _ \| '_ \/ __|
		//  ___) | |_| | |_) \__ \ (__| |  | | |_) | |_| | (_) | | | \__ \
		// |____/ \__,_|_.__/|___/\___|_|  |_| .__/ \__|_|\___/|_| |_|___/
		//                                   |_|
		//

		time$.subscribe(message => {
			let when = moment();
			let time_speak = when.format('h:m A on dddd, MMMM Do YYYY');
			let time_log = when.format('YY/MM/DD HH:mm:ss');

			client.tell(this.settings.channel, `!speak It is ${time_speak}`);
			console.log(`RxBot Time - ${time_log}`);
		});
	}
}

module.exports = Module;
