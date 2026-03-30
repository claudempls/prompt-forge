export type DiffToken = { text: string; type: 'same' | 'added' | 'removed' }

// Tokenize string into words + whitespace chunks
function tokenize(text: string): string[] {
  return text.match(/\S+|\s+/g) ?? []
}

// Simple LCS-based word diff
function lcs(a: string[], b: string[]): number[][] {
  const m = a.length, n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1])
  return dp
}

function backtrack(dp: number[][], a: string[], b: string[], i: number, j: number, result: DiffToken[]) {
  if (i === 0 && j === 0) return
  if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
    backtrack(dp, a, b, i - 1, j - 1, result)
    result.push({ text: a[i - 1], type: 'same' })
  } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
    backtrack(dp, a, b, i, j - 1, result)
    result.push({ text: b[j - 1], type: 'added' })
  } else {
    backtrack(dp, a, b, i - 1, j, result)
    result.push({ text: a[i - 1], type: 'removed' })
  }
}

export function computeDiff(original: string, enhanced: string): DiffToken[] {
  const a = tokenize(original)
  const b = tokenize(enhanced)

  // For very long texts, cap tokens to avoid stack overflow
  const maxTokens = 300
  const aTrunc = a.slice(0, maxTokens)
  const bTrunc = b.slice(0, maxTokens)

  const dp = lcs(aTrunc, bTrunc)
  const result: DiffToken[] = []
  backtrack(dp, aTrunc, bTrunc, aTrunc.length, bTrunc.length, result)

  // Append remaining tokens as added if truncated
  if (b.length > maxTokens) {
    result.push({ text: ' …', type: 'added' })
  }

  return result
}

// Merge consecutive same-type tokens (except whitespace) for cleaner display
export function mergeDiff(tokens: DiffToken[]): DiffToken[] {
  const out: DiffToken[] = []
  for (const tok of tokens) {
    const prev = out[out.length - 1]
    if (prev && prev.type === tok.type && tok.text.trim() !== '') {
      prev.text += tok.text
    } else {
      out.push({ ...tok })
    }
  }
  return out
}
