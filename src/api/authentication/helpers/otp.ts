export function getOtp(length: number = 4): number {
  let otp = "";
  for (let i = 1; i <= 4; i++) {
    const digit = Math.round(Math.random() * 1000) % 10;
    otp += digit;
  }
  return Number.parseInt(otp);
}
