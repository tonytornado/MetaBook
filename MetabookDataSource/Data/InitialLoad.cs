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
            Person book = new Person { FirstName = "Tony", LastName = "Thigpen", Email = "tonyt@gmail.com", Website = "https://www.tonythigpen.com" };

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
                },
                new Moment()
                {
                    Name = "The Next Happening",
                    Location = "Tampa, FL",
                    StartTime = new DateTime(2019,9,3,12,0,0),
                    EndTime = new DateTime(2019,9,3,18,0,0),
                    Description = "Well, it's happening again.",
                }
            };
            foreach (var item in happening)
            {
                item.Participants.Add(book);
                context.Events.Add(item);

            }
            context.SaveChanges();

            // Add the todo list items.
            var todolist = new Todo[]
            {
                new Todo(){
                    Title = "Work on the thing",
                    Description = "There's a thing that needs to be worked on. You should be working on it.",
                    CreatedDate = DateTime.Now,
                    DueDate = new DateTime(2021,9,11,12,0,0),
                    Completed = false,
                },
                new Todo(){
                    Title = "Improve the other thing",
                    Description = "Something needs an improvement",
                    CreatedDate = DateTime.Now,
                    DueDate = new DateTime(2021,10,11,12,0,0),
                    Completed = false,
                },
            };
            foreach (var item in todolist)
            {
                context.Tasks.Add(item);
            }
            context.SaveChanges();
        }
    }
}
