const express = require('express');
const VotingPost = require('../models/VotingPost');

const router = express.Router();

/*
  CREATE VOTING POST
*/
router.post('/', async (req, res) => {
  try {
    const {
      productId,
      productName,
      productImage,
      productPrice,
      addedBy,
      friends
    } = req.body;

    const post = await VotingPost.create({
      productId,
      productName,
      productImage,
      productPrice,
      addedBy,
      friends,
      votes: []
    });

    res.status(201).json(post);

  } catch (error) {
    console.error(
      'Create voting post error:',
      error
    );

    res.status(500).json({
      error: 'Failed to create voting post'
    });
  }
});


/*
  GET POSTS CREATED BY USER
*/
router.get('/user/:userId', async (req, res) => {
  try {
    const posts = await VotingPost.find({
      addedBy: req.params.userId
    }).sort({
      createdAt: -1
    });

    res.json(posts);

  } catch (error) {
    console.error(
      'Get user voting posts error:',
      error
    );

    res.status(500).json({
      error: 'Failed to fetch voting posts'
    });
  }
});


/*
  GET PENDING POSTS FOR FRIEND
*/
router.get('/pending/:friendId', async (req, res) => {
  try {
    const { friendId } = req.params;

    const posts = await VotingPost.find({
      'friends.friendId': friendId,

      votes: {
        $not: {
          $elemMatch: {
            friendId: friendId
          }
        }
      }

    }).sort({
      createdAt: -1
    });

    res.json(posts);

  } catch (error) {

    console.error(
      'Get pending votes error:',
      error
    );

    res.status(500).json({
      error: 'Failed to fetch pending votes'
    });
  }
});


/*
  SUBMIT / UPDATE VOTE
*/
router.post('/:postId/vote', async (req, res) => {
  try {
    const {
      friendId,
      friendName,
      vote
    } = req.body;

    if (
      !['like', 'dislike', 'excellent']
        .includes(vote)
    ) {
      return res.status(400).json({
        error: 'Invalid vote'
      });
    }

    const post = await VotingPost.findById(
      req.params.postId
    );

    if (!post) {
      return res.status(404).json({
        error: 'Voting post not found'
      });
    }

    // Check whether this friend already voted
    const existingVoteIndex =
      post.votes.findIndex(
        v => v.friendId === friendId
      );

    const voteData = {
      friendId,
      friendName,
      vote,
      votedAt: new Date()
    };

    if (existingVoteIndex >= 0) {
      // Update existing vote
      post.votes[existingVoteIndex] =
        voteData;
    } else {
      // Add new vote
      post.votes.push(voteData);
    }

    await post.save();

    res.json({
      success: true,
      post
    });

  } catch (error) {
    console.error(
      'Submit vote error:',
      error
    );

    res.status(500).json({
      error: 'Failed to submit vote'
    });
  }
});

router.delete('/:postId', async (req, res) => {
  try {

    const { postId } = req.params;

    const deletedPost = await VotingPost.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({
        error: 'Voting post not found'
      });
    }

    res.json({
      success: true,
      message: 'Voting post removed successfully'
    });

  } catch (error) {

    console.error('Delete voting post error:', error);

    res.status(500).json({
      error: 'Failed to delete voting post'
    });
  }
});


module.exports = router;