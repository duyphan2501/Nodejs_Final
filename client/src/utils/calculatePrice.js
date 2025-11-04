const calculateItemsDiscounted = (cartItems) =>
  cartItems.reduce((totalDiscount, item) => {
    const discountedPerItem = (item.price * item.discount) / 100;
    return totalDiscount + discountedPerItem * item.quantity;
  }, 0);

const calculateTotal = (cartItems) => {
  if (!cartItems || !Array.isArray(cartItems)) {
    return 0;
  }
  const totalAmount = cartItems.reduce((accumulator, item) => {
    const discountPercent = item.discount || 0;
    let priceAfterDiscount = item.price * (1 - discountPercent / 100);
    priceAfterDiscount = Math.round(priceAfterDiscount / 1000) * 1000;
    const itemTotal = priceAfterDiscount * item.quantity;
    return accumulator + itemTotal;
  }, 0);

  return totalAmount;
};

const calculateDiscountedPrice = (price, discount=0) => {
  return Math.round(price * (1 - discount / 100) / 1000) * 1000;
}



export { calculateTotal, calculateItemsDiscounted, calculateDiscountedPrice };
