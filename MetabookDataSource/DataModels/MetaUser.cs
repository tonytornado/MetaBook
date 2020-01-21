using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace MetaBookDataSource.Data
{
    public class MetaUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public ICollection<Person> UserContacts { get; set; } = new HashSet<Person>();
        

        //public ICollection<Event> Events { get; }
    }
}
 