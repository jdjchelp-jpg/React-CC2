export function calculateEloChange(
  winnerElo: number,
  loserElo: number,
  isDraw: boolean = false
): { winnerChange: number; loserChange: number } {
  const K = 32;
  const expectedWin = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));
  const expectedLoss = 1 - expectedWin;

  if (isDraw) {
    const winnerChange = Math.round(K * (0.5 - expectedWin));
    const loserChange = Math.round(K * (0.5 - expectedLoss));
    return { winnerChange, loserChange };
  }

  const winnerChange = Math.round(K * (1 - expectedWin));
  const loserChange = Math.round(K * (0 - expectedLoss));

  return { winnerChange, loserChange };
}

export function getHeroRank(elo: number): string {
  if (elo >= 2400) return 'Eternal Frost God';
  if (elo >= 2000) return 'Blizzard Grandmaster';
  if (elo >= 1800) return 'Aurora Legend';
  if (elo >= 1600) return 'Blizzard Master';
  if (elo >= 1400) return 'Ice Champion';
  if (elo >= 1300) return 'Frost Knight';
  if (elo >= 1200) return 'Winter Warrior';
  if (elo >= 1100) return 'Frost Cadet';
  return 'Snow Recruit';
}
