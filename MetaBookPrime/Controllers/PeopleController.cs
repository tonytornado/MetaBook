using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MetaBookDataSource.Data;
using MetaBookDataSource.Models;
using MetaBookDataResource.Enums;
using System.Collections.ObjectModel;
using Microsoft.AspNetCore.Identity;

namespace MetaBookPrime.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PeopleController : ControllerBase
    {
        private readonly MetaBookAPIContext _context;
        private readonly UserManager<MetaUser> _userManager;

        public PeopleController(MetaBookAPIContext context, UserManager<MetaUser> userManager)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
        }

        // GET: api/People/Phones
        /// <summary>
        /// Gets all phone types from enum list
        /// </summary>
        /// <returns></returns>
        [HttpGet("Phones")]
        public ActionResult<IEnumerable<PhoneType>> GetPhoneTypes()
        {
            return Ok(EnumExtensions.GetValues<PhoneType>());
        }

        // GET: api/People/Address
        /// <summary>
        /// Gets all address types from enum list
        /// </summary>
        /// <returns></returns>
        [HttpGet("Addresses")]
        public ActionResult<IEnumerable<BuildingType>> GetAddressTypes()
        {
            return Ok(EnumExtensions.GetValues<BuildingType>());
        }

        /// <summary>
        /// Gets all states from enum list
        /// </summary>
        /// <returns></returns>
        [HttpGet("States")]
        public ActionResult<IEnumerable<State>> GetStates()
        {
            return Ok(EnumExtensions.GetValues<State>());
        }

        // GET: api/People
        /// <summary>
        /// Gets all contacts that are public
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Person>>> GetPeople()
        {
            MetaUser user = await _userManager.GetUserAsync(User);

            return await _context.People.Where(p => p.Owner == user)
                .ToListAsync();
        }

        // GET: api/People/5
        /// <summary>
        /// Retrieve a person with a specified id
        /// </summary>
        /// <param name="id">Person object's id</param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<Person>> GetPerson(int id)
        {
            Person person = await _context.People
                .Include(p => p.Phones)
                .Include(p => p.Addresses)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (person == null)
            {
                return NotFound();
            }

            return person;
        }

        // PUT: api/People/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPerson(
            int id,
            MetaUser user,
            [FromForm] Person person)
        {
            if (user is null)
            {
                return BadRequest();
            }

            if (id != person.Id)
            {
                return BadRequest();
            }

            _context.Entry(person).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PersonExists(id))
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

        // POST: api/People
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Person>> PostPerson(
            [FromForm]bool AddressCheck,
            [FromForm]bool phoneCheck,
            [FromForm]Person peep,
            [FromForm]Address address,
            [FromForm]Phone phone)
        {
            MetaUser user = await _userManager.GetUserAsync(HttpContext.User);

            if (user is null)
            {
                throw new ArgumentNullException(nameof(user));
            }

            Person person = peep;

            // Check for an address
            if (AddressCheck)
            {
                Address addy = address;
                person.Addresses.Add(addy);
            }

            // Check for a phone
            if (phoneCheck)
            {
                Phone caller = phone;
                person.Phones.Add(caller);
            }

            person.Owner = user;

            _context.People.Add(person);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPerson", new { id = person.Id }, person);
        }

        // DELETE: api/People/5
        /// <summary>
        /// Deletes a person
        /// </summary>
        /// <param name="id">Person's id to remove</param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        public async Task<ActionResult<Person>> DeletePerson(int id)
        {
            var person = await _context.People.FindAsync(id);
            if (person == null)
            {
                return NotFound();
            }

            _context.People.Remove(person);
            await _context.SaveChangesAsync();

            return person;
        }

        private bool PersonExists(int id)
        {
            return _context.People.Any(e => e.Id == id);
        }
    }
}
