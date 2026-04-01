export function factorial(n: number): number {
  if (n < 0) return 0;
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

export function combinations(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  if (k > n / 2) k = n - k;
  let res = 1;
  for (let i = 1; i <= k; i++) {
    res = res * (n - i + 1) / i;
  }
  return res;
}

// Discrete Distributions
export const discrete = {
  bernoulli: (k: number, p: number) => {
    if (k !== 0 && k !== 1) return 0;
    return k === 1 ? p : 1 - p;
  },
  binomial: (k: number, n: number, p: number) => {
    if (k < 0 || k > n) return 0;
    return combinations(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
  },
  poisson: (k: number, lambda: number) => {
    if (k < 0) return 0;
    return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
  },
  geometric: (k: number, p: number) => {
    if (k < 1) return 0;
    return Math.pow(1 - p, k - 1) * p;
  },
  negativeBinomial: (k: number, r: number, p: number) => {
    if (k < 0) return 0;
    return combinations(k + r - 1, k) * Math.pow(1 - p, k) * Math.pow(p, r);
  },
  hypergeometric: (k: number, N: number, K: number, n: number) => {
    if (k < Math.max(0, n - (N - K)) || k > Math.min(n, K)) return 0;
    return (combinations(K, k) * combinations(N - K, n - k)) / combinations(N, n);
  }
};

// Continuous Distributions (PDFs)
export const continuous = {
  uniform: (x: number, a: number, b: number) => {
    if (x < a || x > b) return 0;
    return 1 / (b - a);
  },
  exponential: (x: number, lambda: number) => {
    if (x < 0) return 0;
    return lambda * Math.exp(-lambda * x);
  },
  normal: (x: number, mu: number, sigma: number) => {
    const exponent = -Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2));
    return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
  },
  // CDFs
  normalCDF: (x: number, mu: number, sigma: number) => {
    const z = (x - mu) / (sigma * Math.sqrt(2));
    return 0.5 * (1 + erf(z));
  }
};

// Error function (approximation for Normal CDF)
function erf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);
  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
  return sign * y;
}
