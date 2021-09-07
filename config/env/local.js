module.exports = {
  DB: process.env.DB || 'mongodb+srv://pavan334:kumar555@cluster0.oezae.mongodb.net/test?retryWrites=true&w=majority',
  PORT: process.env.PORT || '3000',
  IS_CONSOLE_LOG: process.env.IS_CONSOLE_LOG || 'true'
}
