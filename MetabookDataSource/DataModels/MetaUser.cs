using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace MetaBookDataSource.Data
{
    public class MetaUser : IdentityUser
    {
        public ICollection<Person> UserContacts { get; }
        //public ICollection<Event> Events { get; }
    }
}
