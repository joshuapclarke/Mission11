// src/AdminBooks.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { type Book } from './CartContext';

export const AdminBooks = () => {
    const [books, setBooks] = useState<Book[]>([]);
    
    // --- THESE ARE THE MISSING STATE VARIABLES ---
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<Book>({
        bookId: 0, title: '', author: '', publisher: '', isbn: '',
        classification: '', category: '', pageCount: 0, price: 0
    });

const fetchBooks = async (page: number) => {
        try {
            // UPDATED AZURE URL
            const response = await fetch(`https://mission13-clarke-backend-edcsdmayhfhnefbe.francecentral-01.azurewebsites.net/api/books?pageNum=${page}`);
            const result = await response.json();
            
            // Log the result to the browser console so we can inspect it
            console.log("API Response:", result); 

            // Safely grab the books and total pages
            setBooks(result.books || result.Books || []);
            const pages = result.paginationInfo?.totalPages || result.PaginationInfo?.TotalPages || 1;
            setTotalPages(pages);
            
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    // --- FIX: Pass 'currentPage' as the argument ---
    useEffect(() => {
        fetchBooks(currentPage);
    }, [currentPage]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'price' || name === 'pageCount' || name === 'bookId' 
                ? Number(value) 
                : value
        });
    };

    const handleEditClick = (book: Book) => {
        setFormData(book);
        setShowForm(true);
    };

    const handleDeleteClick = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                // UPDATED AZURE URL
                const response = await fetch(`https://mission13-clarke-backend-edcsdmayhfhnefbe.francecentral-01.azurewebsites.net/api/books/${id}`, {
                    method: 'DELETE',
                });
                
                if (response.ok) {
                    // --- FIX: Pass 'currentPage' as the argument ---
                    fetchBooks(currentPage); 
                }
            } catch (error) {
                console.error('Error deleting book:', error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const isEditing = formData.bookId !== 0;
        
        // UPDATED AZURE URLS
        const url = isEditing 
            ? `https://mission13-clarke-backend-edcsdmayhfhnefbe.francecentral-01.azurewebsites.net/api/books/${formData.bookId}` 
            : `https://mission13-clarke-backend-edcsdmayhfhnefbe.francecentral-01.azurewebsites.net/api/books`;
            
        try {
            const response = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(isEditing ? formData : { ...formData, bookId: undefined }),
            });

            if (response.ok) {
                setCurrentPage(1); 
                // --- FIX: Pass '1' as the argument ---
                fetchBooks(1); 
                setShowForm(false); 
                setFormData({
                    bookId: 0, title: '', author: '', publisher: '', isbn: '',
                    classification: '', category: '', pageCount: 0, price: 0
                });
            } else {
                console.error('Error saving book:', await response.text());
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className="container mt-4 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Admin: Manage Books</h2>
                <div>
                    <Link to="/" className="btn btn-outline-secondary me-2">Back to Store</Link>
                    <button 
                        className="btn btn-primary"
                        onClick={() => {
                            setFormData({ bookId: 0, title: '', author: '', publisher: '', isbn: '', classification: '', category: '', pageCount: 0, price: 0 });
                            setShowForm(!showForm);
                        }}
                    >
                        {showForm ? 'Cancel' : 'Add New Book'}
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="card p-4 mb-4 shadow-sm">
                    <h4>{formData.bookId === 0 ? 'Add a New Book' : 'Edit Book'}</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Title</label>
                                <input type="text" className="form-control" name="title" value={formData.title} onChange={handleInputChange} required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Author</label>
                                <input type="text" className="form-control" name="author" value={formData.author} onChange={handleInputChange} required />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Publisher</label>
                                <input type="text" className="form-control" name="publisher" value={formData.publisher} onChange={handleInputChange} required />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">ISBN</label>
                                <input type="text" className="form-control" name="isbn" value={formData.isbn} onChange={handleInputChange} required />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Price</label>
                                <input type="number" step="0.01" className="form-control" name="price" value={formData.price} onChange={handleInputChange} required />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Classification</label>
                                <input type="text" className="form-control" name="classification" value={formData.classification} onChange={handleInputChange} required />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Category</label>
                                <input type="text" className="form-control" name="category" value={formData.category} onChange={handleInputChange} required />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Page Count</label>
                                <input type="number" className="form-control" name="pageCount" value={formData.pageCount} onChange={handleInputChange} required />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-success mt-3">Save Book</button>
                    </form>
                </div>
            )}

            <table className="table table-striped table-bordered align-middle">
                <thead className="table-dark">
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th className="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book) => (
                        <tr key={book.bookId}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.category}</td>
                            <td>${book.price.toFixed(2)}</td>
                            <td className="text-center">
                                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditClick(book)}>Edit</button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteClick(book.bookId)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* NEW PAGINATION CONTROLS */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <span>Page {currentPage} of {totalPages}</span>
                    <div>
                        <button 
                            className="btn btn-secondary me-2" 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                            Previous
                        </button>
                        <button 
                            className="btn btn-secondary" 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};