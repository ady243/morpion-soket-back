import express, { json } from "express"
import rateLimit from "express-rate-limit"
import helmet from "helmet"
import xss from "xss-clean"
import hpp from "hpp"
import cors from "cors"
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import userRoutes from "./routes/user.routes.js"
import chatRoute from "./routes/chat.routes.js"
import messageRoute from "./routes/message.routes.js"

import globalErrHandler from "./controllers/error.controller.js"
import AppError from "./utils/appError.js"


const app = express()

// Options pour la documentation Swagger
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'API temps réel socket',
      version: '1.0.0',
      description: 'Description de l\'API',
    },
    servers: ['https://morpion-soket-back.vercel.app/'],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Allow Cross-Origin requests
app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",

}))

// Set security HTTP headers
app.use(helmet())

// Limit request from the same API
const limiter = rateLimit({
  max: 2000,
  windowMs: 60 * 60 * 1000,
  message: "Too Many Request from this IP, please try again in an hour",
  handler: (req, res, next) => {
    res.status(500).send({
      message: "Too Many Request from this IP, please try again in an hour",
    })
  },
})

app.use("/api", limiter)

// Body parser, reading data from body into req.body
app.use(
  json({
    limit: "15kb",
  })
)

// Data sanitization
app.use(xss())

// Prevent parameter pollution
app.use(hpp())

app.use(express.json())

// Routes
app.get("/", async (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to the API",
  })
})
app.use("/api/users", userRoutes)
app.use("/api/chats", chatRoute)
app.use("/api/messages", messageRoute)

// handle undefined Routes
app.use("*", (req, res, next) => {
  const err = new AppError(404, "fail", "undefined route")
  next(err, req, res, next)
})

app.use(globalErrHandler)

export default app    