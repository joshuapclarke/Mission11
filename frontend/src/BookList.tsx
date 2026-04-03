import { useEffect, useState, useContext } from 'react';
import { CartContext, type Book } from './CartContext';
import { CartSummary } from './CartSummary'; // Make sure you created this file from the previous step!

// Interface for the new nested JSON response from our updated C# API
interface BookResponse {
  books: Book[];
  paginationInfo: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
  currentCategory: string | null;
}

interface BookListProps {
  onViewCart: () => void;
}

// Hardcoded categories for the sidebar (you can also fetch these dynamically from the DB later if you want)
const CATEGORIES = ["Biography", "Self-Help", "Fiction", "Non-Fiction", "Mystery"];

export const BookList: React.FC<BookListProps> = ({ onViewCart }) => {
  const [showToast, setShowToast] = useState(false);
  const [data, setData] = useState<BookResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Consume the Cart Context so we can add items
  const cartContext = useContext(CartContext);

useEffect(() => {
    const fetchBooks = async () => {
      try {
        // UPDATED AZURE URL
        let url = `https://mission13-clarke-backend-edcsdmayhfhnefbe.francecentral-01.azurewebsites.net/api/books?pageNum=${currentPage}`;
        if (selectedCategory) {
          url += `&category=${selectedCategory}`;
        }

        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    fetchBooks();
  }, [currentPage, selectedCategory]); // Re-run the fetch when page or category changes

  // Helper function to handle category clicks
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Always reset to page 1 when changing categories
  };

  return (
    <div className="container mt-4">
      
      {/* Header & Cart Summary Row */}
      <div className="row mb-4 align-items-center">
        <div className="col-md-8">
          <h2>Professor Hilton's Book Collection</h2>
        </div>
        <div className="col-md-4">
          <CartSummary onViewCart={onViewCart} />
        </div>
      </div>

      {/* Main Content Layout using Bootstrap Grid */}
      <div className="row">
        
        {/* Sidebar: Categories */}
        <div className="col-md-3 mb-4">
          <div className="d-grid gap-2">
            <button 
                className={`btn ${selectedCategory === '' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => handleCategoryClick('')}
            >
                Home / All Books
            </button>
            {CATEGORIES.map(cat => (
                <button 
                    key={cat}
                    className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleCategoryClick(cat)}
                >
                    {cat}
                </button>
            ))}
          </div>
        </div>
        {/* Main Area: Book Table & Pagination */}
        <div className="col-md-9">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Publisher</th>
                <th>ISBN</th>
                <th>Category</th>
                <th>Pages</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.books.map((book) => (
                <tr key={book.bookId}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.publisher}</td>
                  <td>{book.isbn}</td>
                  <td>{book.classification} / {book.category}</td> 
                  <td>{book.pageCount}</td>
                  <td>${book.price.toFixed(2)}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-success"
                      onClick={() => {
                          cartContext?.addToCart(book);
                          setShowToast(true);
                          setTimeout(() => setShowToast(false), 3000); // Hide after 3 seconds
                      }}
                    >
                      Add to Cart
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Dynamic Pagination UI */}
          {data && data.paginationInfo.totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span>
                Page {data.paginationInfo.currentPage} of {data.paginationInfo.totalPages} 
                ({data.paginationInfo.totalItems} total books)
              </span>
              <div>
                <button 
                  className="btn btn-secondary me-2" 
                  disabled={data.paginationInfo.currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  Previous
                </button>
                <button 
                  className="btn btn-secondary" 
                  disabled={data.paginationInfo.currentPage === data.paginationInfo.totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bootstrap Toast Notification */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div className={`toast ${showToast ? 'show' : 'hide'}`} role="alert">
          <div className="toast-header bg-success text-white">
            <strong className="me-auto">Cart Updated</strong>
            <button type="button" className="btn-close btn-close-white" onClick={() => setShowToast(false)}></button>
          </div>
          <div className="toast-body bg-white text-dark">
            Item successfully added to your cart!
          </div>
        </div>
      </div>

    </div>
  );
};