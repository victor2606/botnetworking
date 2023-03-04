const { Scenes: { WizardScene }, Composer, Telegraf, session, Markup } = require('telegraf')

module.exports = (base_ctx) => {

  const reply = (ctx) => {
    return ctx.send(`Благодарим за ответы 🙏 Теперь тебе остался один шаг, чтоб открылась  возможность писать сообщения в чате “БИЗНЕС-СООБЩЕСТВО КЛД / НЕТВОРКИНГ” 
    \nПрежде чем писать в чате, прошу ознакомится с правилами, а также с инфой чем для тебя может быть полезен чат.`)
  }

  const handlerName = Telegraf.on("text", async ctx => {
    ctx.session.user.name = ctx.message.text;
    ctx.send("Введите Ваш номер телефона:")
    return ctx.wizard.next()    
  });

  const handlerPhone = Telegraf.on("text", async ctx => {
    if (/^\d+$/.test(ctx.message.text)) {
      ctx.session.user.phone = ctx.message.text;
      ctx.send("Укажите ссылки на Ваши соц.сети или сайт (одним сообщением):")
      return ctx.wizard.next()  
    } else ctx.reply("Принимаються только цифры!")
  });

  const handlerSocial = Telegraf.on("text", async ctx => {
    ctx.session.user.social = ctx.message.text;
    ctx.send("Введите Вашу сферу деятельности:")
    return ctx.wizard.next()    
  });

  const handlerWork = Telegraf.on("text", async ctx => {
    ctx.session.user.work = ctx.message.text;
    ctx.send(`Опишите подробно Вашу сферу деятельности (${ctx.session.user.social}):`)
    return ctx.wizard.next()    
  });

  const handlerWorkAbout = Telegraf.on("text", async ctx => {
    ctx.session.user.work_about = ctx.message.text;
    ctx.send(`Какой у вас доход?`, Markup
      .inlineKeyboard([
        [Markup.button.callback("До 100", "price-100")],
        [Markup.button.callback("100-300", "price-100-300")],
        [Markup.button.callback("300-500", "price-300-500")],
        [Markup.button.callback("До 1000000", "price-1000000")],
        [Markup.button.callback("Больше 100000", "price-100000")]
      ])
    )
    return ctx.wizard.next()    
  });

  const handlerPrice = new Composer();
  
  handlerPrice
  .action(/^price-(.*)$/, async ctx => {
    const [, type] = ctx.match;
    ctx.session.user.earn = type
    await ctx.edit(`Вы выбрали ${type}.`)
    await ctx.send("Был уже на мероприятиях?", Markup
      .inlineKeyboard([
        [Markup.button.callback("Да", "yes")],
        [Markup.button.callback("Нет", "no")]
      ])
    )
  })
  .action("yes", async ctx => {
    ctx.answerCbQuery()
    ctx.edit("Вы были уже на мероприятиях? Да.")
    ctx.send("Что больше всего понравилось?")
    return ctx.wizard.next()
  })
  .action("no", async ctx => {
    ctx.answerCbQuery()
    ctx.edit("Вы были уже на мероприятиях? Нет.")
    ctx.send("Что хочешь получить от мероприятия?")
    return ctx.wizard.next()
  })

  const handlerAnswer = Telegraf.on("text", async ctx => {
    ctx.session.user.answer = ctx.message.text;
    console.log(ctx.message.from.username);
    ctx.user.edit("registration", ctx.session.user)
    await ctx.telegram.sendMessage(-1001859432020, `Регистрация в чате:\n${ctx.session.user.name} @${ctx.message.from.username}\n${ctx.session.user.phone}\n${ctx.session.user.social}\n${ctx.session.user.work}\n${ctx.session.user.work_about}\n${ctx.session.user.earn}\n${ctx.session.user.answer}`)
    reply(ctx)
    await ctx.telegram.promoteChatMember(ctx.settings.body.chat.chat_id, ctx.from.id, {
      can_change_info: false,
      can_post_messages: true,
      can_edit_messages: true,
      can_delete_messages: true,
      can_invite_users: true,
      can_restrict_members: false,
      can_pin_messages: false,
      can_promote_members: false
    });
    await ctx.sendBack("Осталось только ознакомиться с правилами 👇")
    return ctx.scene.leave() 
  });

  const registration = new WizardScene(
    "registration",
    handlerName,
    handlerPhone,
    handlerSocial,
    handlerWork,
    handlerWorkAbout,
    handlerPrice,
    handlerAnswer
  );

  registration.enter(async ctx => {
    ctx.session.user = {};
    return ctx.send('Введите Ваше ФИО:')
  })
    

  return registration;
}
