exports.currencyFormatter = data => {
    return (data.account * 100 / 100).toLocaleString(data.currency, {
        style: 'currency',
        currency: data.currency
    })
}