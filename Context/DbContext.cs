using csharp.Models;
using Microsoft.EntityFrameworkCore;

namespace csharp.Context
{
    public class ContextAPI : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<PurchaseInformations> PurchaseInformations { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"Server=DESKTOP-KKPJKI1\SQLEXPRESS;Database=ProjectTables;Trusted_Connection=True;MultipleActiveResultSets=true");
        }
    }
}