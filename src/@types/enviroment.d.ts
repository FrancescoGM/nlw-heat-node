declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production'
    GITHUB_CLIENT_ID: string
    GITHUB_CLIENT_SECRET: string
    JWT_SECRET: string
    PORT: string
  }
}
