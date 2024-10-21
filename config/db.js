const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MonogoDB connected: ${connect.connection.host}`.bgYellow);
  } catch (error) {
    console.log(`error :${error.message}`);
    process.exit();
  }
};

module.exports = connectDB;
