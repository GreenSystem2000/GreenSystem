namespace csharp.Models
{
    public class Product
    {
        public long ProductId { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public int Amount { get; set; }
        public long SupplierId { get; set; }
        public Supplier Supplier { get; set; }
    }
}