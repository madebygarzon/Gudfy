export const formatCommisionCoinpal = (total: number) => {
  const commisionGudfy = (total * 0.01) + total;
  const commisionBinance = commisionGudfy + (commisionGudfy * 0.01);

  return commisionBinance;
};