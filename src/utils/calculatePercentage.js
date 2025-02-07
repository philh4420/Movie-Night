export default function calculatePercentage(pollVotes, index) {
  const totalVotes = pollVotes.reduce((sum, count) => sum + count, 0);
  return totalVotes === 0 ? 0 : ((pollVotes[index] / totalVotes) * 100).toFixed(1);
}