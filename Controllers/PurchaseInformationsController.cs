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
    public class PurchaseInformationsController : ControllerBase
    {
        private ContextAPI db;
        public PurchaseInformationsController()
        {
            db = new ContextAPI();
        }

        [HttpGet]
        public async Task<ActionResult<List<PurchaseInformations>>> Get()
        {
            try
            {
                List<PurchaseInformations> purchaseInformations = db.PurchaseInformations
                                                                    .Include(a => a.Product)
                                                                    .ToList();
                return purchaseInformations;
            }
            catch(Exception ex)
            {
                return NotFound();
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PurchaseInformations>> Get(long id)
        {
            try
            {
                PurchaseInformations purchaseInformations = await db.PurchaseInformations.FindAsync(id);

                if (id == 0)
                {
                    throw new Exception("Invalid ID");
                }
                else if (purchaseInformations == null)
                {
                    return NotFound();
                }
                else
                {
                    return purchaseInformations;
                }
            }
            catch(Exception ex)
            {
                return NotFound();
            }
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] PurchaseInformations purchaseInformations)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else if (purchaseInformations == null)
            {
                return NotFound();
            }
            db.PurchaseInformations.Add(purchaseInformations);
            await db.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(long id, [FromBody] PurchaseInformations purchaseInformations)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else if (id != purchaseInformations.PurchaseInformationsId)
            {
                return BadRequest();
            }
            db.Entry(purchaseInformations).State = EntityState.Modified;
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
            PurchaseInformations purchaseInformations = await db.PurchaseInformations.FindAsync(id);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else if (id == 0)
            {
                return BadRequest();
            }
            else if (purchaseInformations == null)
            {
                return NotFound();
            }
            db.PurchaseInformations.Remove(purchaseInformations);
            await db.SaveChangesAsync();
            
            return NoContent();
        }
    }
}