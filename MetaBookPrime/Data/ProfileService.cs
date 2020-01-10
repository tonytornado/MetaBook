using IdentityServer4.Models;
using IdentityServer4.Services;

using MetaBookDataSource.Data;

using Microsoft.AspNetCore.Identity;

using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace MetaBookPrime
{
    public class ProfileService : IProfileService
    {
        protected UserManager<MetaUser> _userManager;

        public ProfileService(UserManager<MetaUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            MetaUser user = await _userManager.GetUserAsync(context.Subject);

            List<Claim> claims = new List<Claim>
            {
                new Claim("FirstName", user.FirstName),
                new Claim("LastName", user.LastName),
                new Claim("Id", user.Id),
            };

            context.IssuedClaims.AddRange(claims);
        }

        public async Task IsActiveAsync(IsActiveContext context)
        {
            MetaUser user = await _userManager.GetUserAsync(context.Subject);

            context.IsActive = (user != null);
        }
    }
}