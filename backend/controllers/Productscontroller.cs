using Microsoft.AspNetCore.Mvc;
using projekt3.Data;
using projekt3.Models;
using Microsoft.EntityFrameworkCore;

namespace projekt3.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase {
        private readonly AppDbContext _context;
        public ProductsController(AppDbContext context) => _context = context;

        [HttpGet]
        public IActionResult GetAll() => Ok(_context.Products.ToList());

        [HttpGet("{id}")]
        public IActionResult GetById(int id) {
            var product = _context.Products.Find(id);
            return product == null ? NotFound() : Ok(product);
        }

        [HttpPost]
        public IActionResult Create(Product product) {
            _context.Products.Add(product);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = product.ProductID }, product);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, Product updated) {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound();
            product.Name = updated.Name;
            product.Price = updated.Price;
            product.Stock = updated.Stock;
            _context.SaveChanges();
            return Ok(product);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound();
            _context.Products.Remove(product);
            _context.SaveChanges();
            return NoContent();
        }
    }
}