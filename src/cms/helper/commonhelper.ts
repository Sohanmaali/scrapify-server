export const generateBillNumber = async (req, model): Promise<string> => {
  // Find the last bill number in the Bill collection
  const lastBill = await model
    .findOne({ bill_number: { $exists: true, $ne: null } })
    .sort({ bill_number: -1 })
    .exec();

  if (!lastBill || isNaN(parseInt(lastBill.bill_number, 10))) {
    return '000001';
  }

  const lastBillNumber = parseInt(lastBill.bill_number, 10);
  const nextBillNumber = lastBillNumber + 1;

  return nextBillNumber.toString().padStart(6, '0');
};

export const generateOtp = () => {
  let otp = Math.floor(1000 + Math.random() * 9000).toString();
  const otpExpiry = new Date();

  otp = process.env.MODE !== "local" ? "1234" : otp
  otpExpiry.setMinutes(otpExpiry.getMinutes() + 1);
  return { otp, otpExpiry }
}