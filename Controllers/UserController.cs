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

    public class UserController : ControllerBase
    {
        private ContextAPI db;
        public UserController()
        {
            this.db = new ContextAPI();
        }

        [HttpGet]
        public async Task<ActionResult<List<User>>> Get()
        {
            try
            {
                List<User> users = this.db.Users.ToList();
                return users;
            }
            catch(Exception ex)
            {
                return NotFound();
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> Get(long id)
        {
            try
            {
                User user = await this.db.Users.FindAsync(id);

                if (id == 0)
                {
                    throw new Exception("Invalid ID");
                }
                else if (user == null)
                {
                    return NotFound();
                }
                else
                {
                    return user;
                }
            }
            catch(Exception ex)
            {
                return NotFound();
            }
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else if (user == null)
            {
                return NotFound();
            }
            this.db.Users.Add(user);
            await db.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(long id, [FromBody] User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else if (id != user.UserId)
            {
                return BadRequest();
            }
            db.Entry(user).State = EntityState.Modified;
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
            User user = await this.db.Users.FindAsync(id);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else if (id == 0)
            {
                return BadRequest();
            }
            else if (user == null)
            {
                return NotFound();
            }
            this.db.Users.Remove(user);
            await db.SaveChangesAsync();
            
            return NoContent();
        }
    }
}