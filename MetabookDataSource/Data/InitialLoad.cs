using MetaBookDataSource.Data;
using MetaBookDataSource.Models;
using System;
using System.Collections.ObjectModel;
using System.Linq;

namespace MetaBookDataResource.DataLoaders
{
    public static class InitialLoad
    {
        public static void Initialize(MetaBookAPIContext context)
        {
            if (context is null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            AddSomeone(context);
        }

        private static void AddSomeone(MetaBookAPIContext context)
        {
            if (context.People.Any())
            {
                return;
            }

            // Build a house
            Address addys = new Address()
            {
                CityName = "Louisville",
                StateName = State.KY,
                StreetName = "3045 Wedgewood Wampum Way",
                PostalCode = 40101,
                AddressType = BuildingType.Home
            };

            // Set up your phone line
            Phone cell = new Phone()
            {
                CallerType = PhoneType.Home,
                PhoneNumber = 8889888452,
            };

            // Make yourself.
            Person book = new Person { FirstName = "Tony", LastName = "Thigpen", Email = "tonyt@gmail.com", Website = "https://www.tonythigpen.com", Addresses = new Collection<Address>(), Phones = new Collection<Phone>() };

            book.Addresses.Add(addys);
            context.SaveChanges();

            book.Phones.Add(cell);
            context.SaveChanges();

            context.People.Add(book);
            context.SaveChanges();

            var happening = new Moment[]
            {
                new Moment()
                {
                    Name = "The Happening",
                    Location = "Tampa, FL",
                    StartTime = new DateTime(2019,9,3,12,0,0),
                    EndTime = new DateTime(2019,9,3,18,0,0),
                    Description = "There is a thing that is happening and you should definitely be in the know about it.",
                    Participants = new Collection<Person>() { book }
                },
                new Moment()
                {
                    Name = "The Next Happening",
                    Location = "Tampa, FL",
                    StartTime = new DateTime(2019,9,3,12,0,0),
                    EndTime = new DateTime(2019,9,3,18,0,0),
                    Description = "Well, it's happening again.",
                    Participants = new Collection<Person>() { book }
                }
            };
            foreach (var item in happening)
            {
                context.Events.Add(item);
            }
            context.SaveChanges();
        }
    }
}
