import { useState } from 'react';
import { BookList } from './BookList';
import { Cart } from './Cart';

export const Store = () => {
  // State to track if the cart is currently open
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      {/* We hide the BookList using Bootstrap's d-none class when the cart is open.
        This ensures the component doesn't unmount, preserving the user's page number!
      */}
      <div className={isCartOpen ? 'd-none' : ''}>
        <BookList onViewCart={() => setIsCartOpen(true)} />
      </div>

      {/* Conditionally render the Cart page */}
      {isCartOpen && (
        <Cart onContinueShopping={() => setIsCartOpen(false)} />
      )}
    </>
  );
};