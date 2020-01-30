using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

        /// <summary>
        /// A collection of people in the event
        /// </summary>
        public ICollection<Person> Participants { get; set; }

        public enum Color
        {
            None,
            Red,
            Blue,
            Yellow,
            Green
        }

        [ForeignKey("OwnerId")]
        public MetaUser Owner { get; set; }
    }
}