/** @format */

exports.currencyFormatter = (data) => {
  console.log(data);
  return ((data.amount * 100) / 100).toLocaleString(data.currency, {
    style: 'currency',
    currency: data.currency,
  });
};
