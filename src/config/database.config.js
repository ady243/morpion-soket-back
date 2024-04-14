import "dotenv/config"
import mongoose from "mongoose"

const env = process.env

export const connectToDatabase = (mongoUrl) => {
  mongoose.connect(mongoUrl , {
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

connectToDatabase(env.MONGO_URL);