const { default: mongoose } = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://Serhii01071994:lenovos650@cluster0.ucorzno.mongodb.net/db-contacts"
    );
    console.log("Success");
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
};
