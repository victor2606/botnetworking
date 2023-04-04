module.exports = (bot) => {
    const moment = require('moment-timezone');

    moment.tz.setDefault('UTC');
    const { Markup } = require("telegraf")
    const workStartTime = moment.utc('08:00', 'HH:mm');
    const workEndTime = moment.utc('23:00', 'HH:mm');
    bot
    .on("message", async ctx => {
            if (!ctx.user.registration) {
                await ctx.telegram.restrictChatMember(ctx.chat.id, ctx.from.id, { 
                    can_send_messages: false, 
                    can_send_media_messages: false, 
                    can_send_other_messages: false, 
                    can_add_web_page_previews: false 
                });
                const {message_id} = await ctx.send("Вы не зарегистрированы в чате, для начала пройдите регистрацию в боте", Markup
                    .inlineKeyboard([
                        [Markup.button.callback("Пройти регистрацию", `https://t.me/${ctx.botInfo.username}`)]
                    ])
                )
                setTimeout(() => { ctx.deleteMessage(message_id) }, 10000)
            }
    })
    // bot
    // .on("message", async (ctx, next) => {
    //     const userTime = moment.utc(moment.tz(ctx.message.date * 1000, ctx.from.timezone).format());
    //     if (userTime.isBefore(workStartTime) || userTime.isAfter(workEndTime)) {
    //         await ctx.deleteMessage();
    //         await ctx.reply(`Извините сейчас не рабочее время :(\n\nРабочее время: в период с 8 утра по 23 вечера`)
    //             .then(message => {
    //                 setTimeout(async function() {ctx.deleteMessage(message.message_id)}, 1000 * 5)
    //             })
    //     } else next();
    // })
}