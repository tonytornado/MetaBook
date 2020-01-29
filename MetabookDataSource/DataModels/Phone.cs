using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MetaBookDataSource.Data
{
    public class Phone
    {
        [Key]
        public int Id { get; set; }

        [Display(Name = "Phone Number")]
        [DataType(DataType.PhoneNumber, ErrorMessage = "This must have ten-digits.")]
        public long PhoneNumber { get; set; }

        [Display(Name = "Caller Type")]
        public PhoneType CallerType { get; set; }

        [NotMapped]
        public string FormattedNumber => $"{PhoneNumber:(###) ###-####}";
    }

    [JsonConverter(typeof(StringEnumConverter))]
    public enum PhoneType
    {
        Home,
        Work,
        Mobile,
        VoIp
    }

}