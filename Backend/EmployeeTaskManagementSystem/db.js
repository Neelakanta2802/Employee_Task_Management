const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // eslint-disable-next-line no-undef
    const url = process.env.URL;

    if (!url) {
      throw new Error("MongoDB URL is missing");
    }

    await mongoose.connect(url);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB connection failed:", error.message);
    // eslint-disable-next-line no-undef
    process.exit(1);
  }
};

module.exports = connectDB;