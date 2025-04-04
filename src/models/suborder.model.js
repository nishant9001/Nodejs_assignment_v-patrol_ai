/*
{
    orderId: ObjectId, // Reference to Master Order
    vendorId: ObjectId, // Reference to User
    customerId: ObjectId, // Reference to User
    items: [
      {
        productId: ObjectId, // Reference to Product
        quantity: Number,
        price: Number
      }
    ],
    totalAmount: Number,
    status: String, // 'pending' | 'shipped' | 'delivered'
  }
*/  