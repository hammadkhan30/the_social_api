const User = require('../models/user');
const Post = require('../models/post');

const sendRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.id;

    if (senderId === receiverId) {
      return res.status(400).json({ message: "You can't send a friend request to yourself" });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (sender.friends.includes(receiverId) || sender.sentRequests.includes(receiverId)) {
      return res.status(400).json({ message: 'Friend request already sent or users are already friends' });
    }

    sender.sentRequests.push(receiverId);
    receiver.receivedRequests.push(senderId);

    await sender.save();
    await receiver.save();

    res.status(200).json({ message: 'Friend request sent' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
};

const acceptRequest = async (req, res) => {
  try {
    const receiverId = req.user.id;
    const senderId = req.params.id;

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver.receivedRequests.includes(senderId)) {
      return res.status(400).json({ message: 'Friend request not found' });
    }

    receiver.friends.push(senderId);
    sender.friends.push(receiverId);

    receiver.receivedRequests = receiver.receivedRequests.filter((request) => request.toString() !== senderId);
    sender.sentRequests = sender.sentRequests.filter((request) => request.toString() !== receiverId);

    await sender.save();
    await receiver.save();

    res.status(200).json({ message: 'Friend request accepted' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
};

const getFriendsPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('friends', 'post');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const friendsPosts = [];

    for (const friend of user.friends) {
      const posts = await Post.find({ author_id: friend._id });
      friendsPosts.push(...posts);
    }

    res.status(200).json({ message: 'Friends posts fetched', posts: friendsPosts });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
};

module.exports = {
  sendRequest,
  acceptRequest,
  getFriendsPosts,
};
