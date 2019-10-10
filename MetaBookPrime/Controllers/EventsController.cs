using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MetaBookDataSource.Data;
using MetaBookDataSource.Models;

namespace MetaBookPrime.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly MetaBookAPIContext _context;

        public EventsController(MetaBookAPIContext context)
        {
            _context = context;
        }

        // GET: api/Events
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Moment>>> GetEvents()
        {
            return await _context.Events.Include(p => p.Participants).ToListAsync();
        }

        // GET: api/Events/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Moment>> GetMoment(int id)
        {
            var moment = await _context.Events.Include(p => p.Participants).SingleOrDefaultAsync(p => p.Id == id);

            if (moment == null)
            {
                return NotFound();
            }

            return moment;
        }

        //GET: api/Events/personal/5
        [HttpGet("personal/{id}")]
        public async Task<ActionResult<ICollection<Moment>>> GetPersonalEvents(int id)
        {
            Person person = await _context.People.FindAsync(id);

            var oink = await _context.Events.Include(e => e.Participants)
                                            .Where(x => x.Participants.Any(i => i.Id == id)).ToListAsync();

            return oink;
        }

        // PUT: api/Events/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMoment(int id, Moment moment)
        {
            if (id != moment.Id)
            {
                return BadRequest();
            }

            _context.Entry(moment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MomentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Events
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Moment>> PostMoment([FromForm]Moment moment)
        {
            _context.Events.Add(moment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMoment", new { id = moment.Id }, moment);
        }

        // DELETE: api/Events/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Moment>> DeleteMoment(int id)
        {
            var moment = await _context.Events.FindAsync(id);
            if (moment == null)
            {
                return NotFound();
            }

            _context.Events.Remove(moment);
            await _context.SaveChangesAsync();

            return moment;
        }

        private bool MomentExists(int id)
        {
            return _context.Events.Any(e => e.Id == id);
        }
    }
}
