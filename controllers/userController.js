const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = "this_is_my_secret";
const User = require("../models/user");

const register = async (req, res) => {
    const { name, email, age, gender } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    try {
      const user = await User.findOne({ email });
      if (!user) {
        try {
          const newUser = new User({
            name,
            email,
            password: hashedPassword,
            age, 
            gender, 
          });
  
          await newUser.save();
          return res.status(200).json({
            message: "New User saved",
            user: newUser,
          });
        } catch (error) {
          return res.status(500).json({
            message: "Error in saving the new user",
            error,
          });
        }
      } else {
        res.status(401).json({
          message: "User Already exist",
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: "some error",
        error,
      });
    }
  };
  

const signIn = async(req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          message: "User doesn't exist",
        });
      }
      const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({
          message: "Wrong Password",
        });
      }
  
      const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });
  
      return res.status(200).json({
        message: "User Logged in",
        token,
        name: user.name, 
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error",
        error,
      });
    }
  };
  

const searchUsers = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'Name parameter is required' });
  }

  try {
    const users = await User.find({ name: new RegExp(name, 'i') });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const sendFriendRequest = async (req, res) => {
  const { recipientId } = req.body;
  const senderId = req.user._id;

  if (!recipientId) {
    return res.status(400).json({ error: 'Recipient ID is required' });
  }

  try {
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    const existingRequest = recipient.friendRequests.find(
      (request) => request.sender.toString() === senderId
    );

    if (existingRequest) {
      return res
        .status(400)
        .json({ error: 'Friend request already sent or completed' });
    }

    recipient.friendRequests.push({
      sender: senderId,
    });

    await recipient.save();

    res.status(200).json({ message: 'Friend request sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const viewFriendRequests = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('friendRequests.sender', 'name email');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ friendRequests: user.friendRequests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateFriendRequestStatus = async (userId, requestId, status) => {
  const user = await User.findById(userId);
  if (!user) {
    return { error: 'User not found' };
  }

  const request = user.friendRequests.id(requestId);
  if (!request) {
    return { error: 'Friend request not found' };
  }

  request.status = status;
  await user.save();

  return { message: `Friend request ${status}` };
};

const acceptFriendRequest = async (req, res) => {
  const { requestId } = req.params;
  const userId = req.user.id;

  try {
    const result = await updateFriendRequestStatus(userId, requestId, 'accepted');
    if (result.error) {
      return res.status(404).json({ error: result.error });
    }

    res.status(200).json({ message: result.message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const rejectFriendRequest = async (req, res) => {
  const { requestId } = req.params;
  const userId = req.user.id;

  try {
    const result = await updateFriendRequestStatus(userId, requestId, 'rejected');
    if (result.error) {
      return res.status(404).json({ error: result.error });
    }

    res.status(200).json({ message: result.message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
    register,
    signIn,
    searchUsers,
    sendFriendRequest,
    viewFriendRequests,
    updateFriendRequestStatus,
    acceptFriendRequest,
    rejectFriendRequest 
};
