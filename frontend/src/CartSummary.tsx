import React, { useContext } from 'react';
import { CartContext } from './CartContext';

interface CartSummaryProps {
    onViewCart: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ onViewCart }) => {
    const context = useContext(CartContext);
    if (!context) return null;

    const { itemCount, cartTotal } = context;

    return (
        <div className="bg-light p-3 text-end rounded shadow-sm">
            <span>
                <b> {itemCount} </b> item(s) - <b>${cartTotal.toFixed(2)}</b>
            </span>
            <button className="btn btn-outline-primary position-relative" onClick={onViewCart}>
                <i className="bi bi-cart"></i> View Cart
                {itemCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {itemCount}
                        <span className="visually-hidden">items in cart</span>
                    </span>
            )}
            </button>
        </div>
    );
};