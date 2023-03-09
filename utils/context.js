const fs = require('fs');
const { text } = require('stream/consumers');
const { Markup } = require('telegraf')

const basic_options = { parse_mode: 'HTML', disable_web_page_preview: true };

module.exports = (bot) => {
	Object.assign(bot.context, {

		send: async function(text, extra = {}) { 
			const chat_id = extra.chat_id || this.chat.id;
			delete extra.chat_id;
			return this.telegram.sendMessage(chat_id, text, Object.assign(extra, basic_options));
		},

		edit: async function(text, extra = {}){
			const chat_id = extra.chat_id || this.chat.id;
			const message_id = extra.message_id || this.callbackQuery.message.message_id
			delete extra.chat_id;
			delete extra.message_id;
			return this.telegram.editMessageText(chat_id, message_id, null, text, Object.assign(extra, basic_options));
		},
		
		editKeyboard: async function(keyboard, extra = {}) { 
			const chat_id = extra.chat_id || this.chat.id
			const message_id = extra.message_id || this.callbackQuery.message.message_id
			return this.telegram.editMessageReplyMarkup(chat_id, message_id, null, keyboard.reply_markup);
		},
		
		alert: async function(text, extra = {}) { 
			return this.answerCbQuery(text, extra).catch(e => {})
		},

		genMention: function(user){
			const { first_name, last_name, id, username } = user ?? this.from;
			return username ? `@${username} [${id}]` : `<a href='tg://user?id=${id}'>${first_name + (last_name ? ' ' + last_name : '')}</a>`
		},

        pin: function(message_id, extra = {}){
            const chat_id = extra.chat_id || this.chat.id
			console.log(extra.time ? `Сообщение закреплено и будет удалено через ${extra.time} секунд` : true ? 'Сообщение закреплено!' : false)
            if (!extra.time) this.telegram.pinChatMessage(chat_id, message_id)
            else {
				this.telegram.pinChatMessage(chat_id, message_id)
				const delay = (time) => new Promise(resolve => setTimeout(resolve, 1000 * time));
				delay(extra.time).then(() => this.telegram.unpinChatMessage(chat_id, message_id))
			}
        },

		try: async function(func) {
			try {
			  await func();
			} catch (error) {console.log(error);}
		},

		sendStart: async function() {
			await this.send(`Привет, ${this.genMention(this.from)}\nЯ официальный бот чата “БИЗНЕС-СООБЩЕСТВО / НЕТВОРКИНГ КЛД”.\nИ если ты читаешь эти строки, значит ты уже состоишь в этом чате и нам пора знакомиться лично.
			\nМеня зовут Ключник. Меня создал @god_kod для упрощения коммуникации и автоматизации процессов. Уверен, ТЫ ОЦЕНИШЬ!
			\nС радостью хочу представить моих авторов:\nОльга Поляковская - основатель самого крупного сообщества Калининграда\nКатерина Бурма - партнёр, со-автор и со-организатор
			\nБолее подробно обязательно расскажу про моих бизнес-леди позже.`)
			await this.send(`Ближе к сути! Сейчас расскажу про полезности,которые ты будешь получать от меня, а также ОЧЕНЬ ВАЖНО оцифровать всех участников чата и зарегистрировать желающих на ближайшее мероприятие.\nПОЕХАЛИ!
			\nЗдесь ты будешь получать инфу и иметь возможность зарегистрироваться на любое МЕРОПРИЯТИЕ СООБЩЕСТВА
			\nПомимо этого, я буду присылать приглашения на ЗАКРЫТЫЕ МЕРОПРИЯТИЯ от Ольги и Катерины + мероприятия партнеров (о партнёрах тоже расскажу позже👌
			\nА пока выбери кнопку в меню ниже, что тебя интересует 👇)`, Markup
				.keyboard([
					["📖 Правила", "🎭 Мероприятия"], ["🔐 Доступ к чату","💰 Регистрация и оплата"]
				]).resize()
			)
		},

		sendBack: async function(smile, extra = {}){
			const chatId = extra.chat_id || this.chat.id
			await this.telegram.sendMessage(chatId, smile, {
					...Markup.keyboard([
						["📖 Правила", "🎭 Мероприятия"], ["🔐 Доступ к чату","💰 Регистрация и оплата"]
					]).resize(),
				}
			)
		}
	});
};

function chunk (arr, size) {
    return Array.from({
      length: Math.ceil(arr.length / size)
    })
    .fill(null)
    .map(() => arr.splice(0, size));
  }