'use strict';

const Rx = require('rxjs/Rx');
const irc = require('irc');
const assert = require('assert');
const moment = require('moment');

const RxbotLogger = require('rxbot-logger');

let defaults = {};

function Handler(client, options) {
	assert(this instanceof Handler);
//	assert(client instanceof irc.Client);
	assert(typeof options.channel === 'string');

	//  ____                            _   _
	// |  _ \ _ __ ___  _ __   ___ _ __| |_(_) ___  ___
	// | |_) | '__/ _ \| '_ \ / _ \ '__| __| |/ _ \/ __|
	// |  __/| | | (_) | |_) |  __/ |  | |_| |  __/\__ \
	// |_|   |_|  \___/| .__/ \___|_|   \__|_|\___||___/
	//                 |_|
	//

	this.settings = Object.assign({}, defaults, options);

	//  ____  _
	// / ___|| |_ _ __ ___  __ _ _ __ ___  ___
	// \___ \| __| '__/ _ \/ _` | '_ ` _ \/ __|
	//  ___) | |_| | |  __/ (_| | | | | | \__ \
	// |____/ \__|_|  \___|\__,_|_| |_| |_|___/
	//

	let rawStream = Rx.Observable.fromEvent(client, 'raw');

	let channelRawStream = rawStream.filter(message => {
		return message.args[0] === this.settings.channel || message.args[1] === this.settings.channel;
	});

	let channelStream = channelRawStream.filter(message => {
		return message.command === 'PRIVMSG';
	});

	let bangTimeStream = channelStream.filter(message => {
		return message.args[1].substring(0, 5) === '!time';
	});

	//  ____        _                   _       _   _
	// / ___| _   _| |__  ___  ___ _ __(_)_ __ | |_(_) ___  _ __  ___
	// \___ \| | | | '_ \/ __|/ __| '__| | '_ \| __| |/ _ \| '_ \/ __|
	//  ___) | |_| | |_) \__ \ (__| |  | | |_) | |_| | (_) | | | \__ \
	// |____/ \__,_|_.__/|___/\___|_|  |_| .__/ \__|_|\___/|_| |_|___/
	//                                   |_|
	//

	bangTimeStream.subscribe(message => {
		let sentence = '!speak It is ' + moment().format('h:m A on dddd, MMMM Do YYYY');
		client.say(this.settings.channel, sentence);
	});
}

module.exports = Handler;
