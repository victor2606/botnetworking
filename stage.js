const fs = require('fs');
const { Scenes: { Stage }, session, Composer } = require('telegraf')


module.exports = (context) => {
  const scenes = new Stage( fs.readdirSync('scenes')
    .map( filename => {
      const file_ = filename.match('(.+).js')[1]
      console.log(`[LOADSCENE] ${file_}`)
      return require(`./scenes/${file_}`)(context)
    }));
  
  const stages = new Composer();
  stages.use(scenes.middleware());
  return stages;
}