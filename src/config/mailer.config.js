import "dotenv/config"

const env = process.env

const mailerConfig = {
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
    },
    from: process.env.MAILER_FROM,
}

export default mailerConfig