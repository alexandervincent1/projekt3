[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase {
    private readonly AppDbContext _context;
    public OrdersController(AppDbContext context) => _context = context;

    [HttpGet]
    public IActionResult GetAll() => Ok(_context.Orders.Include(o => o.Customer).Include(o => o.OrderItems).ToList());

    [HttpGet("{id}")]
    public IActionResult GetById(int id) {
        var order = _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.OrderItems)
            .FirstOrDefault(o => o.OrderID == id);
        return order == null ? NotFound() : Ok(order);
    }

    [HttpPost]
    public IActionResult Create(Order order) {
        _context.Orders.Add(order);
        _context.SaveChanges();
        return CreatedAtAction(nameof(GetById), new { id = order.OrderID }, order);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, Order updated) {
        var order = _context.Orders.Find(id);
        if (order == null) return NotFound();
        order.Status = updated.Status;
        _context.SaveChanges();
        return Ok(order);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id) {
        var order = _context.Orders.Find(id);
        if (order == null) return NotFound();
        _context.Orders.Remove(order);
        _context.SaveChanges();
        return NoContent();
    }
}