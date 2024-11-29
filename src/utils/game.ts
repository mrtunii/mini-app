export const calculateMultiplier = (elapsedTime: number): number => {
  // Convert elapsed time to seconds
  const seconds = elapsedTime / 1000;
  
  // Base multiplier growth rate
  const baseGrowth = 0.5;
  
  // Calculate multiplier with acceleration
  // The longer it goes, the faster it increases
  const multiplier = 1 + (baseGrowth * seconds) + (0.1 * Math.pow(seconds, 1.5));
  
  // Round to 2 decimal places
  return Math.round(multiplier * 100) / 100;
};