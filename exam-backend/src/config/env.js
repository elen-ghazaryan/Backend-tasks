import dotenv from 'dotenv'
dotenv.config()

export const env = {
    PORT: process.env.APP_PORT,
    ...process.env
}