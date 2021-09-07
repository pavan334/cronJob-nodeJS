import APP from 'express'
import DBConnection from './app/modules/operations/blManager'
import Utils from './app/utils'
import Config from './config'
import routes from './routes'
import { httpConstants } from './app/common/constants'


const app = new APP()
app.use(APP.json());
require('./config/express')(app)
global.lhtWebLog = Utils.lhtLog
class Server {
  static listen () {
    Promise.all([DBConnection.DBconnect()]).then(() => {
      app.listen(Config.PORT)
      Utils.lhtLog('listen', `Server Started on port ${Config.PORT}`, {}, 'AyushK', httpConstants.LOG_LEVEL_TYPE.INFO)
      routes(app)
      require('./config/jobInitializer')
    }).catch(error => Utils.lhtLog('listen', 'failed to connect', { err: error }, 'AyushK', httpConstants.LOG_LEVEL_TYPE.ERROR))
  }
}

Server.listen()
