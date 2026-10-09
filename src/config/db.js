const mongoose = require("mongoose");

const initDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to Mongo: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection failure:", error.message);
    process.exit(1);
  }
};

module.exports = initDatabase;