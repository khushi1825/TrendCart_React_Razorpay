import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/currency';

const Vote = () => {
  const { friends, votingPosts, voteOnPost, getFriendVoteStatus, getPendingVotesForFriend, getVoteCounts, removeVotingPost } = useAppContext();
  const { user } = useAuth();
  const [selectedFriendId, setSelectedFriendId] = useState(friends[0]?.id || '');

  const pendingForSelected = selectedFriendId ? getPendingVotesForFriend(selectedFriendId) : [];

  const handleVote = (postId, friendId, voteType) => {
    voteOnPost(postId, friendId, voteType);
    alert(`Voted ${voteType} on this dress!`);
  };

  const handleRemovePost = (postId) => {
    if (window.confirm('Are you sure you want to remove this dress from voting?')) {
      removeVotingPost(postId);
    }
  };

  return (
    <div className="container">
      <h1 style={{ margin: '2rem 0' }}>🗳️ Dress Voting Center</h1>
      
      <div className="vote-section">
        <h3>📢 All Shared Dresses for Voting</h3>
        {votingPosts.length === 0 ? (
          <p>No dresses added for voting yet. Go to Shop and click "Add for Vote" on any dress!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {votingPosts.map(post => {
              const counts = getVoteCounts(post._id);
              const isOwner = user && post.addedBy === user.id;
              return (
                <div key={post.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                    <img src={post.productImage} alt={post.productName} style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div>
                      <h4>{post.productName}</h4>
                      <p>💰 {formatINR(post.productPrice)}</p>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <span>👍 Like: {counts.like}</span>
                        <span>👎 Dislike: {counts.dislike}</span>
                        <span>🌟 Excellent: {counts.excellent}</span>
                      </div>
                    </div>
                  </div>
                  {isOwner && (
                    <button onClick={() => handleRemovePost(post.id)} className="btn btn-outline btn-sm" style={{ color: 'red', borderColor: 'red' }}>
                      🗑️ Remove
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {friends.length > 0 ? (
        <div className="vote-section">
          <h3>👥 Vote as a Friend</h3>
          <div className="form-group">
            <label>Select Friend:</label>
            <select value={selectedFriendId} onChange={(e) => setSelectedFriendId(e.target.value)} style={{ width: '100%', padding: '0.5rem' }}>
              {friends.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>

          {selectedFriendId && (
            <>
              <div className="notification">
                🔔 Pending votes for {friends.find(f => f.id === selectedFriendId)?.name}: {pendingForSelected.length} new dress(es) to vote!
              </div>
              {pendingForSelected.length === 0 ? (
                <p>No pending votes. All dresses have been rated by this friend.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {pendingForSelected.map(post => {
                    const currentVote = getFriendVoteStatus(post.id, selectedFriendId);
                    return (
                      <div key={post.id} style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <img src={post.productImage} alt={post.productName} style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                          <div>
                            <strong>{post.productName}</strong>
                            <div className="vote-actions">
                              <button onClick={() => handleVote(post.id, selectedFriendId, 'like')} className="btn btn-primary btn-sm">👍 Like</button>
                              <button onClick={() => handleVote(post.id, selectedFriendId, 'dislike')} className="btn btn-outline btn-sm">👎 Dislike</button>
                              <button onClick={() => handleVote(post.id, selectedFriendId, 'excellent')} className="btn btn-outline btn-sm">🌟 Excellent</button>
                            </div>
                            {currentVote && <p>Current vote: {currentVote}</p>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="vote-section">
          <p>⚠️ No friends added yet. Go to "Friends" page to add friends so they can vote on your dresses!</p>
        </div>
      )}
    </div>
  );
};

export default Vote;