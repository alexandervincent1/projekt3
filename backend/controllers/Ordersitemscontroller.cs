using Microsoft.AspNetCore.Mvc;
using projekt3.Data;
using projekt3.Models;
using Microsoft.EntityFrameworkCore;

namespace projekt3.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderItemsController : ControllerBase {
        private readonly AppDbContext _context;
        public OrderItemsController(AppDbContext context) => _context = context;

        [HttpGet]
        public IActionResult GetAll() => Ok(_context.OrderItems.Include(oi => oi.Product).Include(oi => oi.Order).ToList());

        [HttpGet("{id}")]
        public IActionResult GetById(int id) {
            var item = _context.OrderItems
                .Include(oi => oi.Product)
                .Include(oi => oi.Order)
                .FirstOrDefault(oi => oi.OrderItemID == id);
            return item == null ? NotFound() : Ok(item);
        }

        [HttpPost]
        public IActionResult Create([FromBody] OrderItem item) {
            _context.OrderItems.Add(item);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = item.OrderItemID }, item);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, OrderItem updated) {
            var item = _context.OrderItems.Find(id);
            if (item == null) return NotFound();
            item.Quantity = updated.Quantity;
            _context.SaveChanges();
            return Ok(item);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) {
            var item = _context.OrderItems.Find(id);
            if (item == null) return NotFound();
            _context.OrderItems.Remove(item);
            _context.SaveChanges();
            return NoContent();
        }
    }
}