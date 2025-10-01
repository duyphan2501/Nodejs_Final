const formatMoney = (money) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(money);
};

const getDiscountedPrice = (price, discount = 0) => {
  const discountedValue = Math.round(price * (1 - discount / 100) / 1000) * 1000;
  return {
    formatedPrice: formatMoney(price),                 
    formatedDiscountedPrice: formatMoney(discountedValue)
  };
};


export { formatMoney, getDiscountedPrice };
