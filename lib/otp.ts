export function generateOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export const OTP_TTL_MS = 5 * 60 * 1000;
