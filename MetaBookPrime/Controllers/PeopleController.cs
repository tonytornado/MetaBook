﻿using System;
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
        [HttpGet("Phones")]
        public ActionResult<IEnumerable<PhoneType>> GetPhoneTypes()
        {
            return Ok(EnumExtensions.GetValues<PhoneType>());
        }

        // GET: api/People/Address
        [HttpGet("Addresses")]
        public ActionResult<IEnumerable<BuildingType>> GetAddressTypes()
        {
            return Ok(EnumExtensions.GetValues<BuildingType>());
        }

        [HttpGet("States")]
        public ActionResult<IEnumerable<State>> GetStates()
        {
            return Ok(EnumExtensions.GetValues<State>());
        }

        // GET: api/People
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Person>>> GetPeople()
        {

            MetaUser user = await _userManager.GetUserAsync(HttpContext.User);

            return await _context.People.Where(p => p.Owner == user)
                .ToListAsync();
        }

        // GET: api/People/5
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
        public async Task<IActionResult> PutPerson(int id, Person person)
        {
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
        public async Task<ActionResult<Person>> PostPerson([FromForm]string AddressCheck,
            [FromForm]string phoneCheck,
            [FromForm]Person peep,
            [FromForm]Address address,
            [FromForm]Phone phone)
        {
            if (string.IsNullOrEmpty(AddressCheck))
            {
                throw new ArgumentException("This can't be a null, though", nameof(AddressCheck));
            }

            if (string.IsNullOrEmpty(phoneCheck))
            {
                throw new ArgumentException("This can't be null tho.", nameof(phoneCheck));
            }

            Person person = peep;


            if (AddressCheck == "on")
            {
                Address addy = address;
                person.Addresses = new Collection<Address> { addy };
            }

            if (phoneCheck == "on")
            {
                Phone caller = phone;
                person.Phones = new Collection<Phone> { caller };
            }

            _context.People.Add(person);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPerson", new { id = person.Id }, person);
        }

        // DELETE: api/People/5
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
