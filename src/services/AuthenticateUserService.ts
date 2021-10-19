import axios from 'axios'
import { sign } from 'jsonwebtoken'

import { prismaClient } from '../prisma'

interface IAccessTokenResponse {
  access_token: string
}

interface IUserResponse {
  id: number
  name: string
  login: string
  avatar_url: string
}

export class AuthenticateUserService {
  async execute(code: string) {
    const url = 'https://github.com/login/oauth/access_token'

    const { data } = await axios.post<IAccessTokenResponse>(url, null, {
      params: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      },
      headers: {
        Accept: 'application/json'
      }
    })

    const response = await axios.get<IUserResponse>(
      'https://api.github.com/user',
      {
        headers: {
          Authorization: `Bearer ${data.access_token}`
        }
      }
    )

    const { login, id, name, avatar_url } = response.data

    let user = await prismaClient.user.findFirst({
      where: {
        github_id: id
      }
    })

    if (!user) {
      user = await prismaClient.user.create({
        data: {
          github_id: id,
          login,
          name,
          avatar_url
        }
      })
    }

    const token = sign(
      {
        user: {
          name: user.name,
          avatar_url: user.avatar_url,
          id: user.id
        }
      },
      process.env.JWT_SECRET || '',
      {
        subject: user.id,
        expiresIn: '1d'
      }
    )

    return { user, token }
  }
}
