using Microsoft.AspNetCore.Mvc;
using projekt3.Data;
using projekt3.Models;
using Microsoft.EntityFrameworkCore;

namespace projekt3.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase {
        private readonly AppDbContext _context;
        public CustomersController(AppDbContext context) => _context = context;

        [HttpGet]
        public IActionResult GetAll() => Ok(_context.Customers.ToList());

        [HttpGet("{id}")]
        public IActionResult GetById(int id) {
            var customer = _context.Customers.Find(id);
            return customer == null ? NotFound() : Ok(customer);
        }

        [HttpPost]
        public IActionResult Create(Customer customer) {
            _context.Customers.Add(customer);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = customer.CustomerID }, customer);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, Customer updated) {
            var customer = _context.Customers.Find(id);
            if (customer == null) return NotFound();
            customer.Name = updated.Name;
            customer.Email = updated.Email;
            customer.Phone = updated.Phone;
            _context.SaveChanges();
            return Ok(customer);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) {
            var customer = _context.Customers.Find(id);
            if (customer == null) return NotFound();
            _context.Customers.Remove(customer);
            _context.SaveChanges();
            return NoContent();
        }
    }
}