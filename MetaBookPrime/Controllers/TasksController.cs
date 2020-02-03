using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MetaBookDataSource.Data;
using MetaBookDataSource.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MetaBookPrime.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly MetaBookAPIContext _context;

        public TasksController(MetaBookAPIContext context)
        {
            _context = context;
        }

        // GET: api/Tasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Todo>>> GetTasks()
        {
            return await _context.Tasks.ToListAsync();
        }

        // GET: api/Tasks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Todo>> GetTodo(int id)
        {
            var todo = await _context.Tasks.FindAsync(id);

            if (todo == null)
            {
                return NotFound();
            }

            return todo;
        }

        // PUT: api/Tasks/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        [Authorize]
        [Route("{id}")]
        public async Task<IActionResult> PutTodo(int id, Todo todo)
        {
            if (id != todo.Id)
            {
                return BadRequest();
            }

            _context.Entry(todo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TodoExists(id))
                {
                    return NotFound();
                }

                throw;
            }

            return NoContent();
        }

        // POST: api/Tasks
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Todo>> PostTodo([FromForm]Todo todo)
        {
            todo.CreatedDate = DateTime.Now;
            _context.Tasks.Add(todo);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTodo", new { id = todo.Id }, todo);
        }

        // DELETE: api/Tasks/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult<Todo>> DeleteTodo(int id)
        {
            var todo = await _context.Tasks.FindAsync(id);
            if (todo == null)
            {
                return NotFound();
            }

            _context.Tasks.Remove(todo);
            await _context.SaveChangesAsync();

            return todo;
        }
        
        /// <summary>
        /// Enables marking completion of a task in the DB
        /// </summary>
        /// <param name="id"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        [Route("Completed/{id}/{status}")]
        [Authorize]
        public async Task<ActionResult<Todo>> MarkComplete(int id, bool status)
        {
            var todo = await _context.Tasks.SingleOrDefaultAsync(e => e.Id == id);
            if(todo == null){
                return NotFound();
            }

            todo.Completed = status;
            todo.CompletedDate = DateTime.Now;
            await _context.SaveChangesAsync();


            return Ok();
        }

        private bool TodoExists(int id)
        {
            return _context.Tasks.Any(e => e.Id == id);
        }
    }
}
