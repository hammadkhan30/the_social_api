const Post = require('../models/post');
const User = require('../models/user');

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const author_id = req.user.id;

    const newPost = new Post({
      title,
      content,
      author_id,
    });

    await newPost.save();

    await User.findByIdAndUpdate(author_id, {
      $push: { post: newPost._id },
    });

    res.status(201).json({ 
        message: 'Post created successfully', 
        post: newPost 
    });
  } catch (error) {
    console.error('Error creating post:', error.message);
    console.error(error.stack); 
    res.status(500).json({ message: 'Error creating post', error });
  }  
};

const editPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content } = req.body;
    const userId = req.user.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ 
        message: 'Post not found' 
        });
    }

    if (post.author_id.toString() !== userId) {
      return res.status(403).json({ 
        message: 'You are not authorized to edit this post' 
        });
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, { title, content }, { new: true });

    res.status(200).json({ message: 
        'Post updated successfully', 
        post: updatedPost });
  } catch (error) {
    res.status(500).json({ 
        message: 'Error updating post', 
        error 
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ 
        message: 'Post not found' 
        });
    }

    if (post.author_id.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error });
  }
};

module.exports = {
  createPost,
  editPost,
  deletePost,
};
