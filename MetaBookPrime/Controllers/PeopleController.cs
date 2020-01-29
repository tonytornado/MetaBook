using MetaBookDataResource.Enums;

using MetaBookDataSource.Data;
using MetaBookDataSource.Models;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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

        // GET: api/People/Phonebook
        /// <summary>
        /// Gets all contacts that are private
        /// </summary>
        /// <returns>List of private contacts</returns>
        [Authorize]
        [HttpGet("phonebook/{searchString}")]
        public async Task<ActionResult<IEnumerable<Person>>> GetPeople(string searchString)
        {
            //MetaUser user = await _userManager.GetUserAsync(User);
            MetaUser user = await _userManager.FindByIdAsync(searchString);

            return await _context.People.Where(p => p.OwnerId == searchString).ToListAsync();
        }

        // GET: api/People
        /// <summary>
        /// Gets all contacts that are private
        /// </summary>
        /// <returns></returns>
        public async Task<ActionResult<IEnumerable<Person>>> GetAllPeople()
        {
            return await _context.People.ToListAsync();
        }

        // GET: api/People/detail/5
        /// <summary>
        /// Retrieve a person with a specified id
        /// </summary>
        /// <param name="id">Person object's id</param>
        /// <returns></returns>
        [HttpGet("details/{id}")]
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
        [Authorize]
        [HttpPut("{slug}")]
        public async Task<IActionResult> PutPerson(
            int slug,
            [FromForm]string substring,
            [FromForm]Person person)
        {
            MetaUser user = await _userManager.FindByIdAsync(substring);

            if (!(user is null) && slug == person.Id)
            {
                _context.Entry(person).State = EntityState.Modified;

                try
                {
                    person.OwnerId = substring;
                    user.UserContacts.Add(person);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!PersonExists(slug))
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
            return BadRequest();
        }

        // POST: api/People
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Person>> PostPerson(
            [FromForm]string substring,
            [FromForm]bool addressCheck,
            [FromForm]bool phoneCheck,
            [FromForm]Person peep,
            [FromForm]Address address,
            [FromForm]Phone phone)
        {
            MetaUser user = await _userManager.FindByIdAsync(substring);

            if (user is null)
            {
                throw new ArgumentNullException(nameof(user));
            }

            Person person = peep;

            // Check for an address
            if (addressCheck)
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

            person.OwnerId = substring;
            _context.People.Add(person);
            user.UserContacts.Add(person);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPerson", new { id = person.Id }, person);

        }

        // DELETE: api/People/5
        /// <summary>
        /// Deletes a person
        /// </summary>
        /// <param name="id">Person's id to remove</param>
        /// <returns></returns>
        [Authorize]
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
