export default function formatCellphone(phoneNumber: string) {
  // validate phone number is 10 digits
  if (!/^\d{10}$/.test(phoneNumber)) {
    return phoneNumber;
  }
  return phoneNumber.replace(/(\d{4})(\d{3})(\d{3})/, "$1-$2-$3");
}
