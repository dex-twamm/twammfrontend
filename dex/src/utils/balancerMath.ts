export function proportionalAmount(
  inputTokenAmount: number,
  inputTokenIndex: number,
  spotPrice: number
): number {
  if (inputTokenIndex === 1) return spotPrice * inputTokenAmount;
  else return (1 / spotPrice) * inputTokenAmount;
}

export function priceImpact(inputAmounts: number[], currentBalances: number[]) {
  const currentSpotPrice = getSpotPrice(currentBalances);
  const newSpotPrice = getSpotPrice([
    currentBalances[0] + inputAmounts[0],
    currentBalances[1] + inputAmounts[1],
  ]);

  return Math.abs((newSpotPrice - currentSpotPrice) / currentSpotPrice);
}

export function getSpotPrice(tokenBalances: number[]) {
  return tokenBalances[0] / tokenBalances[1];
}
