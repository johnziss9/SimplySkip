using SimplySkip.Models;

namespace SimplySkip.Tests.Updates
{
    public class UpdateControllerTests
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

                var controller = new UpdateController(new UpdateService(dbContext));

                // Act
                var actionResult = await controller.GetAll();

                // Assert
                var result = actionResult.Result as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal(StatusCodes.Status200OK, result.StatusCode);

                var returnedUpdates = result.Value as List<Update>;
                Assert.NotNull(returnedUpdates);
                Assert.Equal(3, returnedUpdates.Count);
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

                var controller = new UpdateController(new UpdateService(dbContext));

                // Act
                var actionResult = await controller.Create(newUpdate);

                // Assert
                var result = actionResult.Result as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal(StatusCodes.Status200OK, result.StatusCode);

                var returnedUpdate = result.Value as Update;
                Assert.NotNull(returnedUpdate);
                Assert.Equal(newUpdate.Id, returnedUpdate.Id);
                Assert.Equal(newUpdate.Title, returnedUpdate.Title);
                Assert.Equal(newUpdate.Updates, returnedUpdate.Updates);

                // Verify update was added to database
                var savedUpdate = await dbContext.Updates.FindAsync(newUpdate.Id);
                Assert.NotNull(savedUpdate);
                Assert.Equal(newUpdate.Title, savedUpdate.Title);
            }
        }
    }
}