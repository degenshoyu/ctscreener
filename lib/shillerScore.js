const weights = {
  views: 5,
  likes: 100,
  retweets: 200,
  replies: 200,
};

export function calculateShillerScore(t) {
  return (
    (t.views || 0) * weights.views +
    (t.likes || 0) * weights.likes +
    (t.retweets || 0) * weights.retweets +
    (t.replies || 0) * weights.replies
  );
}

export function getShillerWeights() {
  return weights;
}

