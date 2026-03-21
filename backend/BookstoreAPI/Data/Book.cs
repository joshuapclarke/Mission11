using System.ComponentModel.DataAnnotations;

namespace BookstoreAPI.Data 
{
    public class Book
    {
        [Key]
        public int BookId { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Author { get; set; }

        [Required]
        public string Publisher { get; set; }

        [Required]
        public string Isbn { get; set; }

        // Split into two separate properties
        [Required]
        public string Classification { get; set; } 

        [Required]
        public string Category { get; set; }

        // Renamed to match the database
        [Required]
        public int PageCount { get; set; }

        [Required]
        public double Price { get; set; }
    }
}