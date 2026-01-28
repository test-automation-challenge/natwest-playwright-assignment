export function extractAccountNumber(message: string | null | undefined): string | null {
  if (!message || typeof message !== 'string') {
    return null;
  }

  const match = message.match(/\baccount number\b[^0-9]*([0-9]+)/i);
  return match ? match[1] : null;
}
