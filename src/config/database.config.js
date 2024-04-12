import "dotenv/config"
import mongoose from "mongoose"


const env = process.env

let dbConfig = {}

if (!["production", "development", "test"].includes(env.NODE_ENV)) {
  throw new Error("Invalid NODE_ENV")
}

if (env.NODE_ENV === "production") {
  dbConfig = {
    client: env.DB_CLIENT,
    connection: {
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
    },
  }
  mongoose.connect(env.MONGO_URL_DEV ||"mongodb+srv://ady243:soket1234@cluster0.qndpqpb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
}

if (env.NODE_ENV === "development") {
  dbConfig = {
    client: env.DB_CLIENT,
    connection: {
      host: env.DB_HOST_DEV || "localhost",
      port: env.DB_PORT_DEV || 5432,
      user: env.DB_USER_DEV || "postgres",
      password: env.DB_PASSWORD_DEV || "password",
      database: env.DB_NAME_DEV || "postgres",
    },
  }
  mongoose.connect(env.MONGO_URL_DEV || "mongodb+srv://ady243:soket1234@cluster0.qndpqpb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
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