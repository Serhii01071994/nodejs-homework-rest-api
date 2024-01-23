const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Add username"],
  },
  password: {
    type: String,
    required: [true, "Set password for user"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  token: String,

  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, "Verify token is required"],
  },
});

const User = mongoose.model("user", UserSchema);

exports.checkUserEmail = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    console.log("not exist");
  } else {
    console.log("exist");
    throw new Error();
  }
};

exports.findUserByVeryficationToken = async (verificationToken) => {
  const searchUser = await User.findOne({ verificationToken });
  console.log(`searchuser service`, searchUser);
  await User.findByIdAndUpdate(searchUser._id, {
    verify: true,
    verificationToken: null,
  });
  return searchUser;
};

exports.findUserByEmail = async (email) => { 
  const searchUser = await User.findOne({ email });
  await User.findOne({ email: email });
  return searchUser;
}

exports.findUserByFilter = async (filter) => {
  const user = await User.findOne(filter);
  if (!user) {
    throw new Error("Auth error");
  }
  return user;
};

exports.createUser = async (body) => {
  const newUser = await new User(body);

  try {
    await newUser.save();
  } catch (error) {
    console.log(`error:`, error);
  }
  return newUser;
};

exports.updateAvatar = async (avatarUrl, userId) => {
  const userToUpdate = await User.findById(userId);
  userToUpdate.avatar = avatarUrl;
  userToUpdate.save();
};
