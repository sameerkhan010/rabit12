import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FakePayment = ({ totalPrice }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleFakePayment = () => {
    setIsProcessing(true);

    // Simulate payment processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
    }, 2000);
  };

 
  return (
    <div className="p-6 bg-white rounded-lg shadow-md text-center">
      <h2 className="text-xl font-semibold mb-4">Complete Your Payment</h2>
      <p className="text-gray-700 mb-4">Total Amount: ${totalPrice}</p>
      
      {!paymentSuccess ? (
        <button
          onClick={handleFakePayment}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </button>
      ) : (
        <div>
            
          <p  className="text-green-600 font-semibold"> Payment Successful!</p>
          <button
            onClick={() => navigate("/order-conformation")}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300"
          >
            Continue to Order Confirmation
          </button>
        </div>
      )}
    </div>
  );
};

export default FakePayment;
