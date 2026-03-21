using Microsoft.EntityFrameworkCore;

namespace BookstoreAPI.Data
{
    public class BookstoreDbContext : DbContext
    {
        public BookstoreDbContext(DbContextOptions<BookstoreDbContext> options) : base(options) { }

        // This property creates the "Books" table representation in your API
        public DbSet<Book> Books { get; set; }
    }
}