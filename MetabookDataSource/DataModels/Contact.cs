using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MetaBookDataSource.Data
{
    /// <summary>
    /// The basis for most contact types
    /// </summary>
    public class Contact
    {
        public Contact()
        {
        }

        public Contact(int id, string email, ICollection<Phone> phones, ICollection<Address> addresses)
        {
            Id = id;
            Email = email ?? throw new ArgumentNullException(nameof(email));
            Phones = phones ?? throw new ArgumentNullException(nameof(phones));
            Addresses = addresses ?? throw new ArgumentNullException(nameof(addresses));
        }

        [Key]
        public int Id { get; set; }

        [DataType(DataType.EmailAddress)]
        [Display(Name = "Email Address")]
        public string Email { get; set; }

        public MetaUser Owner { get; set; }

        public ICollection<Phone> Phones { get; } = new HashSet<Phone>();
        public ICollection<Address> Addresses { get; } = new HashSet<Address>();

    }

    /// <summary>
    /// A regular contact
    /// </summary>
    public class Person : Contact
    {
        public Person()
        {
        }

        public Person(
            string firstName,
            string lastName,
            string email,
            string website)
        {
            FirstName = firstName ?? throw new ArgumentNullException(nameof(firstName));
            LastName = lastName ?? throw new ArgumentNullException(nameof(lastName));
            Email = email ?? throw new ArgumentNullException(nameof(email));
            Website = website ?? throw new ArgumentNullException(nameof(website));
        }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Website { get; set; }

        [NotMapped]
        public string Name => $"{FirstName} {LastName}";
        [NotMapped]
        public string FullTitle => $"{Name} ({Email})";
    }

    /// <summary>
    /// A business contact
    /// (Not yet implemented)
    /// </summary>
    public class Business : Contact
    {
        public string Name { get; set; }
        public string Website { get; set; }
    }
}

