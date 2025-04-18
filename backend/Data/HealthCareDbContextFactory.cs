using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace backend.Data
{
    public class HealthCareDbContextFactory : IDesignTimeDbContextFactory<HealthCareDbContext>
    {
        public HealthCareDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var connectionString = configuration.GetConnectionString("DefaultConnection");

            var optionsBuilder = new DbContextOptionsBuilder<HealthCareDbContext>();
            optionsBuilder.UseSqlServer(connectionString);

            return new HealthCareDbContext(optionsBuilder.Options);
        }
    }
}
