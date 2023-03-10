const { Telegraf, session } = require('telegraf');
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN)

const load_lib = (filename, default_='./utils') => {
    console.log('[LAODLIB]', filename, default_)
    const path = `${default_}/${filename}`,
        result = require(path)(bot);
    if (result) bot.context[filename] = result
};


load_lib("catch");
load_lib("context");
load_lib("tools");
load_lib("times")

bot.context.users = new bot.context.tools.Users(() => ({
    is_admin: false,
    enter_date: new Date().getTime()
}))
bot.context.settings = new bot.context.tools.JsonBase("settings", {
    chat: {}
})

bot
.use(session())
.use((ctx, next) => {
    if (!ctx.from) return;
    ctx.user = ctx.users.get(ctx.from, true);
    return next();
})
.use(require("./stage")(bot.context))

load_lib("private", "./src")
load_lib("connect", "./src")
load_lib("new_member", "./src")
// load_lib("group", "./src")


bot
.launch({dropPendingUpdates: true})
.then(console.log("Бот запущен!"))