export const formatRupiah = (amount, includeRp = true) => {
  if (isNaN(amount)) return includeRp ? "Rp -" : "-";

  const formattedAmount = new Intl.NumberFormat("id-ID").format(amount);

  return includeRp ? `Rp ${formattedAmount}` : formattedAmount;
};
