using BookstoreAPI.Data;
using Microsoft.AspNetCore.Mvc;

namespace BookstoreAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly BookstoreDbContext _context;

        // Inject the database context via the constructor
        public BooksController(BookstoreDbContext context)
        {
            _context = context;
        }

        // GET: api/Books
        [HttpGet]
        public IActionResult GetBooks()
        {
            // Retrieve all books from the database
            var books = _context.Books.ToList();
            
            return Ok(books);
        }
    }
}