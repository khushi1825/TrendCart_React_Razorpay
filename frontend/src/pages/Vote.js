import React from 'react';

import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/currency';

const Vote = () => {

  const {
    votingPosts,
    voteOnPost,
    getFriendVoteStatus,
    getPendingVotesForFriend,
    getVoteCounts,
    removeVotingPost
  } = useAppContext();

  const { user } = useAuth();

  // ============================================
  // LOGGED-IN USER
  // ============================================

  const currentUserId = user?.id;

  const currentUserName = user?.name || 'User';

  // ============================================
  // POSTS WAITING FOR CURRENT USER'S VOTE
  // ============================================

  const pendingForCurrentUser =
    currentUserId
      ? getPendingVotesForFriend(currentUserId)
      : [];

  // ============================================
  // HANDLE VOTE
  // ============================================

  const handleVote = async (
    postId,
    voteType
  ) => {

    if (!currentUserId) {
      alert('Please login first.');
      return;
    }

    await voteOnPost(
      postId,
      currentUserId,
      voteType,
      currentUserName
    );

    alert(
      `Voted ${voteType} on this dress!`
    );
  };

  // ============================================
  // REMOVE POST
  // ============================================

  const handleRemovePost = (postId) => {

    if (
      window.confirm(
        'Are you sure you want to remove this dress from voting?'
      )
    ) {
      removeVotingPost(postId);
    }
  };

  // ============================================
  // NOT LOGGED IN
  // ============================================

  if (!user) {
    return (
      <div className="container">

        <h1 style={{ margin: '2rem 0' }}>
          🗳️ Dress Voting Center
        </h1>

        <div className="vote-section">
          <p>
            Please login to see dresses shared
            with you for voting.
          </p>
        </div>

      </div>
    );
  }

  // ============================================
  // UI
  // ============================================

  return (

    <div className="container">

      <h1 style={{ margin: '2rem 0' }}>
        🗳️ Dress Voting Center
      </h1>


      {/* ========================================
          PENDING VOTES FOR CURRENT USER
      ======================================== */}

      <div className="vote-section"  style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
  }}>

        <h3>🗳️ Your Voting List</h3>

        <p>
          👤 Logged in as: <strong>{user?.name}</strong>
        </p>


        {pendingForCurrentUser.length === 0 ? (

          <p>
            No new dresses are waiting for your vote.
          </p>

        ) : (

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >

            {pendingForCurrentUser.map(post => {

              const currentVote =
                getFriendVoteStatus(
                  post._id,
                  currentUserId
                );

              return (

                <div
                  key={post._id}
                  style={{
                    background: '#f9f9f9',
                    padding: '1rem',
                    borderRadius: '8px'
                  }}
                >

                  <div
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'center'
                    }}
                  >

                    <img
                      src={post.productImage}
                      alt={post.productName}
                      style={{
                        width: '80px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />

                    <div>

                      <h4>
                        {post.productName}
                      </h4>

                      <p>
                        💰 {formatINR(post.productPrice)}
                      </p>


                      <div
                        className="vote-actions"
                        style={{
                          display: 'flex',
                          gap: '0.5rem',
                          flexWrap: 'wrap'
                        }}
                      >

                        <button
                          onClick={() =>
                            handleVote(
                              post._id,
                              'like'
                            )
                          }
                          className="btn btn-primary btn-sm"
                        >
                          👍 Like
                        </button>


                        <button
                          onClick={() =>
                            handleVote(
                              post._id,
                              'dislike'
                            )
                          }
                          className="btn btn-outline btn-sm"
                        >
                          👎 Dislike
                        </button>


                        <button
                          onClick={() =>
                            handleVote(
                              post._id,
                              'excellent'
                            )
                          }
                          className="btn btn-outline btn-sm"
                        >
                          🌟 Excellent
                        </button>

                      </div>


                      {currentVote && (

                        <p>
                          Current vote: {currentVote}
                        </p>

                      )}

                    </div>

                  </div>

                </div>

              );

            })}

          </div>

        )}

      </div>


      {/* ========================================
          ALL SHARED DRESSES
      ======================================== */}

      <div className="vote-section">

        <h3>
          📢 All Shared Dresses for Voting
        </h3>


        {votingPosts.length === 0 ? (

          <p>
            No dresses added for voting yet.
          </p>

        ) : (

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}
          >

            {votingPosts.map(post => {

              const counts =
                getVoteCounts(post._id);

              const isOwner =
                user &&
                String(post.addedBy) ===
                String(user.id);

              return (

                <div
                  key={post._id}
                  style={{
                    borderBottom: '1px solid #eee',
                    paddingBottom: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >

                  <div
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'center',
                      flex: 1
                    }}
                  >

                    <img
                      src={post.productImage}
                      alt={post.productName}
                      style={{
                        width: '80px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />


                    <div>

                      <h4>
                        {post.productName}
                      </h4>

                      <p>
                        💰 {formatINR(post.productPrice)}
                      </p>


                      <div
                        style={{
                          display: 'flex',
                          gap: '1rem',
                          marginTop: '0.5rem',
                          flexWrap: 'wrap'
                        }}
                      >

                        <span>
                          👍 Like: {counts.like}
                        </span>

                        <span>
                          👎 Dislike: {counts.dislike}
                        </span>

                        <span>
                          🌟 Excellent: {counts.excellent}
                        </span>

                      </div>

                    </div>

                  </div>


                  {isOwner && (

                    <button
                      onClick={() =>
                        handleRemovePost(post._id)
                      }
                      className="btn btn-outline btn-sm"
                      style={{
                        color: 'red',
                        borderColor: 'red'
                      }}
                    >
                      🗑️ Remove
                    </button>

                  )}

                </div>

              );

            })}

          </div>

        )}

      </div>

    </div>

  );
};

export default Vote;