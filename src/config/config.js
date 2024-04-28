import "dotenv/config"
import * as yup from "yup"

import securityConfig from "./security.config.js"


const schema = yup.object().shape({
  environment: yup
    .string()
    .oneOf(["production", "development", "test"])
    .required(),
  port: yup.number().integer().positive().min(80).max(65535).required(),
  db: yup.object().shape({
    client: yup.string().oneOf(["mongodb"]).required(),
    connection: yup.string().required(),
  }),
  security: yup.object().shape({
    password: yup.object().shape({
      pepper: yup.string().required(),
      iteration: yup.number().min(10000).required(),
      keylen: yup.number().oneOf([512]).required(),
      digest: yup.string().oneOf(["sha512", "sha256"]).required(),
    }),
    session: yup.object().shape({
      secret: yup.string().required(),
      expireAfter: yup.string().oneOf(["2 days", "3 days"]),
    }),
  }),
  webapp: yup.object().shape({
    origin: yup.array().of(yup.string()).required(),
  }),
})

const data = {
  environment: process.env.NODE_ENV,
  port: process.env.APP_PORT,
  db: {
    client: "mongodb",
    connection: process.env.MONGO_URL,
  },
  security: securityConfig,
  webapp: {
    origin: [],
  },
}

const config = schema.validateSync(data)
export default config