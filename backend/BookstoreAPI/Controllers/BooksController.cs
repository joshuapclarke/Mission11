using BookstoreAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookstoreAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly BookstoreDbContext _context;

        public BooksController(BookstoreDbContext context)
        {
            _context = context;
        }

        // GET ALL / PAGINATION 
        [HttpGet]
        public async Task<IActionResult> GetBooks(string? category, int pageNum = 1)
        {
            int pageSize = 10;
            var query = _context.Books.AsQueryable();

            if (!string.IsNullOrEmpty(category))
            {
                // UPDATE: Check both the Category AND Classification columns
                query = query.Where(b => b.Category == category || b.Classification == category);
            }

            var totalItems = await query.CountAsync();
            var books = await query
                .OrderBy(b => b.Title)
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

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

        //  GET SINGLE BOOK (For editing) 
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBook(int id)
        {
            var book = await _context.Books.FindAsync(id);

            if (book == null)
            {
                return NotFound();
            }

            return Ok(book);
        }

        //  CREATE BOOK 
        [HttpPost]
        public async Task<IActionResult> AddBook([FromBody] Book book)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            // Returns a 201 Created status and the location of the new resource
            return CreatedAtAction(nameof(GetBook), new { id = book.BookId }, book);
        }

        // UPDATE BOOK
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, [FromBody] Book book)
        {
            if (id != book.BookId)
            {
                return BadRequest("The ID in the URL does not match the ID of the book object.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Entry(book).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Books.Any(e => e.BookId == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent(); // 204 No Content is standard for a successful PUT
        }

        // DELETE BOOK 
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return NoContent(); // 204 No Content is standard for a successful DELETE
        }
    }
}