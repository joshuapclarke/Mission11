import React, { useContext } from 'react';
import { CartContext } from './CartContext';

// We accept a function as a prop so we can tell App.tsx to close the cart
interface CartProps {
    onContinueShopping: () => void;
}

export const Cart: React.FC<CartProps> = ({ onContinueShopping }) => {
    const cartContext = useContext(CartContext);

    // Safety check
    if (!cartContext) return null;

    const { cart, cartTotal } = cartContext;

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Your Shopping Cart</h2>
            
            {cart.length === 0 ? (
                <div className="alert alert-info">Your cart is empty.</div>
            ) : (
                <table className="table table-bordered table-striped align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Book Title</th>
                            <th className="text-center">Quantity</th>
                            <th className="text-end">Price</th>
                            <th className="text-end">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((line) => (
                            <tr key={line.book.bookId}>
                                <td>{line.book.title}</td>
                                <td className="text-center">{line.quantity}</td>
                                <td className="text-end">${line.book.price.toFixed(2)}</td>
                                {/* Calculate the subtotal for each line item */}
                                <td className="text-end">${(line.book.price * line.quantity).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={3} className="text-end fw-bold">Total:</td>
                            <td className="text-end fw-bold">${cartTotal.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            )}
            
            <div className="d-flex justify-content-between mt-4">
                {/* This button triggers the function to go back to the exact spot in the BookList */}
                <button className="btn btn-outline-primary" onClick={onContinueShopping}>
                    Continue Shopping
                </button>
                
                {cart.length > 0 && (
                    <button className="btn btn-success">
                        Checkout
                    </button>
                )}
            </div>
        </div>
    );
};