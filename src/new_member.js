const { Markup } = require("telegraf");

module.exports = (bot) => {
    bot
    .on("new_chat_members", async ctx => {
        if (!ctx.message.new_chat_member.is_bot) {
        await ctx.deleteMessage()
        await ctx.telegram.restrictChatMember(ctx.chat.id, ctx.from.id, {
            can_send_messages: false,
            can_send_media_messages: false,
            can_send_other_messages: false,
            can_add_web_page_previews: false
        });

        const messageText = 'Для того чтобы у тебя был полноценный доступ к чату, где ты можешь представиться или писать, пройди, пожалуйста, регистрацию. \nЖми 👇';
        const options = {
            disable_notification: true,
            reply_markup: {
            inline_keyboard: [
                [
                {
                    text: 'Пройти регистрацию',
                    url: `https://t.me/${ctx.botInfo.username}`
                }
                ]
            ]
            }
        };
        await ctx.telegram.sendMessage(ctx.chat.id, messageText, options).then((message) => {
            const messageId = message.message_id;
            setTimeout(() => {
            ctx.telegram.deleteMessage(ctx.chat.id, messageId);
            }, 300000);
        });
        bot.action(`https://t.me/${ctx.botInfo.username}`, (ctx) => {
        ctx.deleteMessage();
        ctx.answerCbQuery();
        });
    }})
}