using System;
using System.Collections.Generic;
using System.Linq;

namespace MetaBookDataResource.Enums
{
    public static class EnumExtensions
    {
        public static List<EnumValue> GetValues<T>()
        {
            return (from object itemType in Enum.GetValues(typeof(T))
                select new EnumValue()
                {
                    Name = Enum.GetName(typeof(T),
                        itemType),
                    Value = (int) itemType
                }).ToList();
        }
    }

}
