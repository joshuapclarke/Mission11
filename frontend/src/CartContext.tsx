import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react'; // Added 'type' keyword for verbatimModuleSyntax

// Defined the Book interface to resolve the missing module error. 
// Ensure these match your ASP.NET Core Book model!
export interface Book {
    bookId: number;
    title: string;
    author: string;
    publisher: string;
    isbn: string;
    classification: string; 
    category: string;       
    pageCount: number;      
    price: number;
}

export interface CartLine {
    book: Book;
    quantity: number;
}

interface CartContextType {
    cart: CartLine[];
    addToCart: (book: Book) => void;
    cartTotal: number;
    itemCount: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Initialize cart from sessionStorage if it exists
    const [cart, setCart] = useState<CartLine[]>(() => {
        const savedCart = sessionStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Save to sessionStorage whenever the cart changes to maintain the session
    useEffect(() => {
        sessionStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (book: Book) => {
        setCart(prevCart => {
            const existingLine = prevCart.find(line => line.book.bookId === book.bookId);
            if (existingLine) {
                return prevCart.map(line => 
                    line.book.bookId === book.bookId 
                        ? { ...line, quantity: line.quantity + 1 } 
                        : line
                );
            }
            return [...prevCart, { book, quantity: 1 }];
        });
    };

    // Calculate totals automatically when the cart updates
    const cartTotal = cart.reduce((total, line) => total + (line.book.price * line.quantity), 0);
    const itemCount = cart.reduce((count, line) => count + line.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, cartTotal, itemCount }}>
            {children}
        </CartContext.Provider>
    );
};