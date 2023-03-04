const { Scenes: { WizardScene }, Composer, Telegraf, session, Markup } = require('telegraf')

module.exports = (base_ctx) => {

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
    } else ctx.reply("Принимаются только цифры!")
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
    ctx.user.edit("registration", ctx.session.user)
    await ctx.telegram.sendMessage(-838949044, `Регистрация в чате\n${ctx.session.user.name} @${ctx.message.from.username}\n${ctx.session.user.phone}\n${ctx.session.user.social}\n${ctx.session.user.work}\n${ctx.session.user.work_about}\n${ctx.session.user.earn}\n${ctx.session.user.answer}`)
    let link = ""
    if (ctx.session.type === "Стандарт") link = "https://yoomoney.ru/bill/pay/BkAZHwJkskE.230220"
    else link = "https://yoomoney.ru/bill/pay/aSot8AJl2cw.230220"
    await ctx.send(`Вы успешно заполнили анкету, теперь Вы можете оплатить мероприятие ${ctx.session.type}`, Markup
        .inlineKeyboard([
            [Markup.button.url("Оплатить!", link)]
        ])
    )
    setTimeout(() => {
      ctx.send("Вы оплатили участие в мероприятии?", Markup
        .inlineKeyboard([
            [Markup.button.callback("Я оплатил!", "payment-plus")],
            [Markup.button.callback("Я не оплатил", "payment-minus")]
        ])
    )
      }, 100000);
    return ctx.scene.leave()
  });


  const payment = new WizardScene(
    "payment",
    handlerName,
    handlerPhone,
    handlerSocial,
    handlerWork,
    handlerWorkAbout,
  );

  payment.enter(async ctx => {
    ctx.session.user = {};
    return ctx.send('Введите Ваше ФИО:')
  })
    

  return payment;
}
