namespace csharp.Models
{
    public class PurchaseInformations
    {
        public long PurchaseInformationsId { get; set; }
        public long ProductId { get; set; }
        public Product Product { get; set; }
        public string Name { get; set; }
        public string Username { get; set; }
        public string Cep { get; set; }
        public string Cpf { get; set; }
        public string State { get; set; }
        public string City { get; set; }
        public string District { get; set; }
        public string Street { get; set; }
        public int Number { get; set; }
        public string Phone { get; set; }
    }
}