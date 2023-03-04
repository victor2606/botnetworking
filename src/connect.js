module.exports = (bot) => {

    bot
    .command("connect_chat", async ctx => {
        if ( ctx.chat.type === "private" && !ctx.user.is_admin ) return;
        if (Object.keys(ctx.settings.body.chat).length === 0) {
            if (ctx.settings.body.chat.chat_id != ctx.chat.id) {
                const inviteLink = await ctx.createChatInviteLink(ctx.from.id, {
                    expire_date: 0
                })
                const chat = {
                    chat_id: ctx.chat.id,
                    chat_type: ctx.chat.type,
                    chat_title: ctx.chat.title,
                    invite_link: inviteLink.invite_link
                }
                ctx.settings.body.chat = chat
                ctx.settings.save()
                return ctx.reply(`Чат [${chat.chat_title} | ${chat.chat_id}] был успешно подключен!`, {
                    chat_id: ctx.from.id
                })
            }
        }
    })

}