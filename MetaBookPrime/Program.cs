using MetaBookDataResource.DataLoaders;
using MetaBookDataSource.Models;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;

namespace MetaBookPrime
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateWebHostBuilder(args).Build();

            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var serviceProvider = services.GetRequiredService<IServiceProvider>();
                    var configuration = services.GetRequiredService<IConfiguration>();
                    var context = services.GetRequiredService<MetaBookAPIContext>();

                    // Create the base classes and such for data.
                    try
                    {
                        InitialLoad.Initialize(context);
                    }
                    catch (Exception exc)
                    {
                        var logger = services.GetRequiredService<ILogger<Program>>();
                        logger.LogError(exc, "Initial loader has failed to seed. Damn you, loader. Maybe you were already okay?? I HOPE YOU WERE, DAMMIT.");
                    }
                }
                catch (Exception ex)
                {
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "An error has occurred.");
                }
            }

            host.Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>();
    }
}
