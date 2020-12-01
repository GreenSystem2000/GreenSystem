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
    public class SupplierController : ControllerBase
    {
        private ContextAPI db;
        public SupplierController()
        {
            this.db = new ContextAPI();
        }

        [HttpGet]
        public async Task<ActionResult<List<Supplier>>> Get()
        {
            try
            {
                List<Supplier> suppliers = this.db.Suppliers.ToList();
                return suppliers;
            }
            catch(Exception ex)
            {
                return NotFound();
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Supplier>> Get(long id)
        {
            try
            {
                Supplier supplier = await this.db.Suppliers.FindAsync(id);
                
                if (id == 0)
                {
                    throw new Exception("Invalid ID");
                }
                else if (supplier == null)
                {
                    return NotFound();
                }
                else
                {
                    return supplier;
                }
            }
            catch(Exception ex)
            {
                return NotFound();
            }
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] Supplier supplier)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else if (supplier == null)
            {
                return NotFound();
            }
            this.db.Suppliers.Add(supplier);
            await db.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(long id, [FromBody] Supplier supplier)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else if (id != supplier.SupplierId)
            {
                return BadRequest();
            }
            db.Entry(supplier).State = EntityState.Modified;
            try
            {
                await db.SaveChangesAsync();
            }
            catch(DbUpdateConcurrencyException)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(long id)
        {
            Supplier supplier = await db.Suppliers.FindAsync(id);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else if (id == 0)
            {
                return BadRequest();
            }
            else if (supplier == null)
            {
                return NotFound();
            }
            db.Suppliers.Remove(supplier);
            await db.SaveChangesAsync();
            
            return NoContent();
        }
    }
}