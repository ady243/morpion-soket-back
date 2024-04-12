import knex from "knex"
import { Model } from "objection"
import config from "./config/config.js"
import app from "./app.js"

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down1...",err)
  console.log(err.name, err.message)
  process.exit(1)
})

// Connect the database
const db = knex(config.db)
Model.knex(db)

// Check if the database is connected or not
db.raw("select 1+1 as result")
  .then(() => {
    console.log("👌 Database connected")
  })
  .catch((error) => {
    console.log("❌ Database connection failed",error)
    process.exit(1)
  })

// Start the server
const PORT = config.port

const server = app.listen(PORT, () => {
  console.log(`Environment: ${config.environment}`)
  console.log(`🎉 Listening on port ${PORT}`)
})

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION!!!  shutting down2 ...",err)
  console.log(err.name, err.message)
  server.close(() => {
    process.exit(1)
  })
})

export default app