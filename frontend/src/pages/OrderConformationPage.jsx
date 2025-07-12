import React from "react";

const checkout = {
  _id: "12343",
  createdAt: new Date(),
  checkoutItems: [
    {
      productId: "1",
      name: "Jacket",
      color: "black",
      size: "M",
      price: 100,
      quantity: 1,
      image:
        "https://plus.unsplash.com/premium_photo-1673356302031-86c27e061153?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      productId: "2",
      name: "T-shirt",
      color: "black",
      size: "M",
      price: 150,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ],
  shippingAddress: {
    address: "123 Fashion Street",
    city: "Sikar",
    country: "India",
  },
};

const OrderConformationPage = () => {
  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10); // add 10 days to order date
    return orderDate.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Thank you for your order!
      </h1>

      {checkout && (
        <div className=" p-6 rounded-lg border">
          <div className="flex justify-between mb-20">
            {/* order id and Date */}
            <div>
              <h2 className="text-xl font-semibold">
                Order ID: {checkout._id}
              </h2>
              <p className="text-gray-500 ">
                Order Date: {new Date(checkout.createdAt).toDateString()}
              </p>
            </div>

            {/* Estimated Delivery */}
            <div>
              <p className="text-emerald-700text-sm">
                {" "}
                Estimated Delivery:
                {calculateEstimatedDelivery(checkout.createdAt)}
              </p>
            </div>
          </div>
          {/* order Items */}
          <div className="mb-20 ">
            {checkout.checkoutItems.map((item) => (
              <div key={item.productId} className="flex items-center mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div>
                  <h4 className="text-md font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-500">
                    {item.color} || {item.size}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-md">${item.price}</p>
                  <div className="text-sm text-gray-500">
                    Qty : {item.quantity}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Payment and delivery info*/}
          <div className="grid grid-cols-2 gap-8">
            {/* payment info */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Payment</h4>
              <p className="text-gray-600">PayPal</p>
            </div>
            {/* delivery info */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Delivery</h4>
              <p className="text-gray-600">
                {checkout.shippingAddress.address}
              </p>
              <p className="text-gray-600">
                {checkout.shippingAddress.city},{" "}
                {checkout.shippingAddress.country}{" "}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConformationPage;
