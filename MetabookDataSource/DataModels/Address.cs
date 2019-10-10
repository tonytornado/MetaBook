using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace MetaBookDataSource.Data
{
    public class Address
    {
        public int Id { get; set; }
        public string StreetName { get; set; }
        public string CityName { get; set; }
        public State StateName { get; set; }
        public int PostalCode { get; set; }
        public BuildingType AddressType { get; set; }
    }

    [JsonConverter(typeof(StringEnumConverter))]
    public enum BuildingType
    {
        Home,
        Work,
        Other
    }

    [JsonConverter(typeof(StringEnumConverter))]
    public enum State
    {
        AK,
        AL,
        AR,
        AZ,
        CA,
        CO,
        CT,
        DE,
        FL,
        GA,
        HI,
        IA,
        ID,
        IL,
        IN,
        KS,
        KY,
        LA,
        MA,
        MD,
        ME,
        MI,
        MN,
        MO,
        MS,
        MT,
        NC,
        ND,
        NE,
        NH,
        NJ,
        NM,
        NV,
        NY,
        OH,
        OK,
        OR,
        PA,
        RI,
        SC,
        SD,
        TN,
        TX,
        UT,
        VA,
        VT,
        WA,
        WI,
        WV,
        WY,
        DC
    }
}