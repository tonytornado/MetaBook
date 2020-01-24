﻿using System;
using System.ComponentModel.DataAnnotations;

namespace MetaBookDataSource.Data { 

    public class Todo
    {
        public Todo(){

        }

        public Todo(
            string title, string description, DateTime? dueDate)
        {
            if (string.IsNullOrEmpty(title))
            {
                throw new ArgumentException("message", nameof(title));
            }

            if (string.IsNullOrEmpty(description))
            {
                throw new ArgumentException("message", nameof(description));
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
        [StringLength(5000,ErrorMessage = "You can only have 5000 characters here")]
        public string Description { get; set; }
        [DataType(DataType.Date)]
        public DateTime? DueDate { get; set; }
        [DataType(DataType.Date)]
        public DateTime CreatedDate { get; set; }
        [DataType(DataType.Date)]
        public DateTime? CompletedDate { get; set; }
        public bool Completed { get; set; }

        //public string OwnerId { get; set; }
        /// <summary>
        /// Owner ID
        /// </summary>
        /// [ForeignKey("OwnerID")]
        //public MetaUser Owner { get; set; }
        /// <summary>
        /// Assignee's Owner ID
        /// </summary>
        //public MetaUser AssignedOwner { get; set; }
    }
}
