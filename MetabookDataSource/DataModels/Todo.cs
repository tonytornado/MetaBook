using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MetaBookDataSource.Data
{

    public class Todo
    {
        public Todo()
        {

        }

        public Todo(
                string title, string description, DateTime? dueDate)
        {
            if (string.IsNullOrEmpty(title))
            {
                string Message = "You need a title.";
                throw new ArgumentException(message: Message,
                                            paramName: nameof(title));
            }

            if (string.IsNullOrEmpty(description))
            {
                string Message = "You need a description.";
                throw new ArgumentException(message: Message,
                                            paramName: nameof(description));
            }

            Title = title;
            Description = description;
            DueDate = dueDate ?? DateTime.Now;
            CreatedDate = DateTime.Now;
            CompletedDate = null;
            Completed = false;
        }

        [Key]
        public int Id { get; set; }
        [StringLength(100, ErrorMessage = "You can only have 100 characters here")]
        public string Title { get; set; }
        [StringLength(5000, ErrorMessage = "You can only have 5000 characters here")]
        public string Description { get; set; }
        [DataType(DataType.Date)]
        public DateTime? DueDate { get; set; }
        [DataType(DataType.Date)]
        public DateTime CreatedDate { get; set; }
        [DataType(DataType.Date)]
        public DateTime? CompletedDate { get; set; }
        public bool Completed { get; set; }
        public string TimeToComplete => GetCompletedTimeframe();

        private string GetCompletedTimeframe()
        {
            var x = new TimeSpan(0, 0, 0, 0);
            string message = "";

            if (CompletedDate != null)
            {
                x = (DateTime)CompletedDate
                    - CreatedDate;
            } else {
                x = DateTime.Now
                    - CreatedDate;
            }

            message = $"{x.TotalHours}H: {x.Minutes}M";
            return message;
        }

        public string OwnerId { get; set; }
        [ForeignKey("OwnerId")]
        public MetaUser Owner { get; set; }
    }
}
