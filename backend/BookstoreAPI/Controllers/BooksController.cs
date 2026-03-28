using BookstoreAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Added for async EF Core methods

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
        public async Task<IActionResult> GetBooks(string? category, int pageNum = 1)
        {
            int pageSize = 10; // You can adjust how many books show per page

            // Start with the base query
            var query = _context.Books.AsQueryable();

            // Apply category filter if one is provided
            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(b => b.Category == category);
            }

            // Get the total count for pagination math before we paginate the data
            var totalItems = await query.CountAsync();

            // Fetch the paginated results
            var books = await query
                .OrderBy(b => b.Title) // Assuming your Book model has a Title property
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Structure the JSON response for the React frontend
            var response = new 
            {
                Books = books,
                PaginationInfo = new 
                {
                    CurrentPage = pageNum,
                    ItemsPerPage = pageSize,
                    TotalItems = totalItems,
                    TotalPages = (int)Math.Ceiling((decimal)totalItems / pageSize)
                },
                CurrentCategory = category
            };

            return Ok(response);
        }
    }
}