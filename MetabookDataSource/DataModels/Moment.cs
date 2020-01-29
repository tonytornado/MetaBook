using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MetaBookDataSource.Data
{
    public class Moment
    {
        public int Id { get; set; }
        public string Name { get; set; }
        [Display(Name = "Start Time")]
        [DisplayFormat(DataFormatString = "{0:MM/dd/yyyy HH:mm:ss}")]
        public DateTime StartTime { get; set; }
        [Display(Name = "End Time")]
        [DisplayFormat(DataFormatString = "{0:MM/dd/yyyy HH:mm:ss}")]
        public DateTime EndTime { get; set; }
        public string Location { get; set; }
        public string Description { get; set; }

        public ICollection<Person> Participants { get; } = new HashSet<Person>();

        public enum Color
        {
            None,
            Red,
            Blue,
            Yellow,
            Green
        }

        public MetaUser Owner { get; set; }
    }
}