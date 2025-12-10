public class Product {
    public int ProductID { get; set; }
    public string Name { get; set; } = null!;
    public decimal Price { get; set; }
    public int Stock { get; set; }

    
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}