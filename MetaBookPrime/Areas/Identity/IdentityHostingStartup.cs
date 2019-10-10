using Microsoft.AspNetCore.Hosting;

[assembly: HostingStartup(typeof(MetaBookPrime.Areas.Identity.IdentityHostingStartup))]
namespace MetaBookPrime.Areas.Identity
{
    public class IdentityHostingStartup : IHostingStartup
    {
        public void Configure(IWebHostBuilder builder)
        {
            builder.ConfigureServices((context, services) =>
            {
            });
        }
    }
}