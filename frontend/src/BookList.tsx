import { useEffect, useState } from 'react';

// This interface must match the JSON returned by your C# API
interface Book {
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

export const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);

  // New State Variables
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(5);
  const [sortAscending, setSortAscending] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:40000/api/books');
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    fetchBooks();
  }, []);

  // 1. Sort the books by title
  const sortedBooks = [...books].sort((a, b) => {
    if (sortAscending) {
      return a.title.localeCompare(b.title);
    }
    return b.title.localeCompare(a.title);
  });

  // 2. Calculate pagination indexes
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook);
  
  // 3. Calculate total pages for the pagination UI
  const totalPages = Math.ceil(sortedBooks.length / booksPerPage);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Professor Hilton's Book Collection</h2>
      
      {/* Controls Row */}
      <div className="d-flex justify-content-between mb-3">
        <div>
          <label className="me-2">Results per page:</label>
          <select 
            className="form-select d-inline-block w-auto" 
            value={booksPerPage} 
            onChange={(e) => {
              setBooksPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to page 1 when changing page size
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        
        <button 
          className="btn btn-outline-primary"
          onClick={() => setSortAscending(!sortAscending)}
        >
          Sort by Title {sortAscending ? '(A-Z)' : '(Z-A)'}
        </button>
      </div>

      {/* Book Table */}
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Category</th>
            <th>Pages</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {currentBooks.map((book) => (
            <tr key={book.bookId}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.publisher}</td>
              <td>{book.isbn}</td>
              {/* Combining classification and category into one column */}
              <td>{book.classification} / {book.category}</td> 
              {/* Updated to pageCount */}
              <td>{book.pageCount}</td>
              <td>${book.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination UI */}
      <div className="d-flex justify-content-between align-items-center">
        <span>Page {currentPage} of {totalPages}</span>
        <div>
          <button 
            className="btn btn-secondary me-2" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          <button 
            className="btn btn-secondary" 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};