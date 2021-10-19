import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

import { router } from './routes'

const app = express()

app.use(cors())
app.use(express.json())
app.use(router)

export const serverHttp = http.createServer(app)

export const io = new Server(serverHttp, {
  cors: {
    origin: '*'
  }
})

io.on('connection', socket => {
  console.log(`Usuário conectado no socket ${socket.id}`)
})
