export const calculateCartTotals = (cartItems, quantities) => {
    const subtotal = cartItems.reduce(
        (acc, food) => acc + food.price * quantities[food.id],
        0
    );
    
    // Delivery fee logic (like Swiggy)
    let deliveryFee = 0;
    let deliveryMessage = "";
    
    if (subtotal > 0) {
        if (subtotal < 199) {
            deliveryFee = 49;
            deliveryMessage = `Add items worth ₹${(199 - subtotal).toFixed(0)} more to reduce delivery fee to ₹29`;
        } else if (subtotal < 399) {
            deliveryFee = 29;
            deliveryMessage = `Add items worth ₹${(399 - subtotal).toFixed(0)} more for FREE delivery!`;
        } else {
            deliveryFee = 0;
            deliveryMessage = "🎉 You saved ₹29 on delivery!";
        }
    }
    
    // Platform fee (like Swiggy's platform fee)
    const platformFee = subtotal > 0 ? 5 : 0;
    
    // GST calculation (5% on food + 18% on delivery & platform fee)
    const foodGST = subtotal * 0.05; // 5% GST on food items
    const serviceGST = (deliveryFee + platformFee) * 0.18; // 18% GST on services
    const totalGST = foodGST + serviceGST;
    
    // Total calculation
    const total = subtotal + deliveryFee + platformFee + totalGST;
    
    return {
        subtotal,
        deliveryFee,
        deliveryMessage,
        platformFee,
        foodGST,
        serviceGST,
        totalGST,
        total
    };
}