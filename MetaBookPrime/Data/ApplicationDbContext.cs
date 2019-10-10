using IdentityServer4.EntityFramework.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using MetaBookDataSource.Data;

namespace MetaBookPrime.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<MetaUser>
    {
        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }
    }
}
