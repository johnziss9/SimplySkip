using SimplySkip.Models;

namespace SimplySkip.Tests.Updates
{
    public class UpdateServiceTests
    {
        private async Task SeedTestData(SSDbContext dbContext)
        {
            dbContext.Updates.AddRange(new List<Models.Update>
                {
                    new Update { Id = 1, Title = "First Update", Updates = "Description for first update", Timestamp = DateTime.UtcNow.AddDays(-2) },
                    new Update { Id = 2, Title = "Second Update", Updates = "Description for second update", Timestamp = DateTime.UtcNow.AddDays(-1) },
                    new Update { Id = 3, Title = "Third Update", Updates = "Description for third update", Timestamp = DateTime.UtcNow }
                });

            await dbContext.SaveChangesAsync();
        }

        [Fact]
        public async Task GetAllUpdates_Success()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);

                var service = new UpdateService(dbContext);

                // Act
                var result = await service.GetAllUpdates();

                // Assert
                Assert.True(result.IsSuccess);
                Assert.NotNull(result.Data);
                Assert.Equal(3, result.Data.Count);
            }
        }

        [Fact]
        public async Task CreateNewUpdate_Success()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                var newUpdate = new Update { Id = 4, Title = "Fourth Update", Updates = "Description for fourth update", Timestamp = DateTime.UtcNow };

                var service = new UpdateService(dbContext);

                // Act
                var result = await service.CreateUpdate(newUpdate);

                // Assert
                Assert.True(result.IsSuccess);
                Assert.NotNull(result.Data);
                Assert.Equal(newUpdate.Id, result.Data.Id);
                Assert.Equal(newUpdate.Title, result.Data.Title);
                Assert.Equal(newUpdate.Updates, result.Data.Updates);

                // Verify the update was added to database
                var savedUpdate = await dbContext.Updates.FindAsync(newUpdate.Id);
                Assert.NotNull(savedUpdate);
                Assert.Equal(newUpdate.Title, savedUpdate.Title);
                Assert.Equal(newUpdate.Updates, savedUpdate.Updates);
            }
        }
    }
}