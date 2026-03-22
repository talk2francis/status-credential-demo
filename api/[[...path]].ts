import { app } from '../packages/api/src/app'
import serverlessHttp from 'serverless-http'

export default serverlessHttp(app)
