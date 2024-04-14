import "dotenv/config"
import mongoose from "mongoose"


const env = process.env

let dbConfig = {}

if (!["production", "development", "fulldevAndProd"].includes(env.NODE_ENV)) {
  throw new Error("Invalid NODE_ENV")
}

if (env.NODE_ENV === "production") {
  mongoose.connect(env.MONGO_URL_DEV , {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .catch((error) => {
    console.log("❌ Database connection failed", error)
    process.exit(1)
  })
  .then(() => {
    console.log("👌 Database mongo db connected")
  });
      
}

if (env.NODE_ENV === "development") {
  dbConfig = {
    client: env.DB_CLIENT,
    connection: {
      host: env.DB_HOST_DEV ,
      port: env.DB_PORT_DEV ,
      user: env.DB_USER_DEV ,
      password: env.DB_PASSWORD_DEV ,
      database: env.DB_NAME_DEV ,
    },
  }
  mongoose.connect(env.MONGO_URL_DEV , {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.catch((error) => {
  console.log("❌ Database mongoDb connection failed", error)
  process.exit(1)
})
.then(() => {
  console.log("👌 Database mongo db connected")
});        

}

if (env.NODE_ENV === "fulldevAndProd") {
 
  mongoose.connect(env.MONGO_URL_DEV , {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.catch((error) => {
  console.log("❌ Database mongoDb connection failed", error)
  process.exit(1)
})
.then(() => {
  console.log("👌 Database mongo db connected")
});        

}

export default {
  client: dbConfig.client,
  connection: dbConfig.connection,
  migrations: {
    directory: "./src/db/migrations/",
  },
  seeds: {
    directory: "./src/db/seeds/",
  },
}