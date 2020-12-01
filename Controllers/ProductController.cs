using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using csharp.Context;
using csharp.Models;
using System.Data;

namespace csharp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductController : ControllerBase
    {
        private ContextAPI db;
        public ProductController()
        {
            this.db = new ContextAPI();
        }

        [HttpGet]
        public async Task<ActionResult<List<Product>>> Get()
        {
            try
            {
                List<Product> products = db.Products
                            .Include(p => p.Supplier)
                            .ToList();
                return products;
            }
            catch(Exception ex)
            {
                return NotFound();
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> Get(long id)
        {
            try
            {
                Product products = await db.Products.FindAsync(id);

                if (id == 0)
                {
                    throw new Exception("Invalid ID");
                }
                else if (products == null)
                {
                    return NotFound();
                }
                else
                {
                    return products;
                }
            }
            catch(Exception ex)
            {
                return NotFound();
            }
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] Product product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else if (product == null)
            {
                return NotFound();
            }
            db.Products.Add(product);
            await db.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(long id, [FromBody] Product product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else if (id != product.ProductId)
            {
                return BadRequest();
            }
            db.Entry(product).State = EntityState.Modified;
            try
            {
                await db.SaveChangesAsync();
            }
            catch(Exception ex)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(long id)
        {
            Product product = await db.Products.FindAsync(id);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else if (id == 0)
            {
                return BadRequest();
            }
            else if (product == null)
            {
                return NotFound();
            }
            db.Products.Remove(product);
            await db.SaveChangesAsync();
            
            return NoContent();
        }
    }
}