import { AxiosError } from 'axios'
import { Request, Response } from 'express'

import { AuthenticateUserService } from '../services/AuthenticateUserService'

export class AuthenticateUserController {
  async handle(req: Request, res: Response) {
    const service = new AuthenticateUserService()
    const { code } = req.body
    try {
      const result = await service.execute(code)

      res.json(result)
    } catch (err) {
      const error = err as AxiosError
      res.json({ error: error.message })
    }
  }
}
