using SimplySkip.Helpers;

namespace SimplySkip.Tests.Skip
{
    public class SkipControllerTests
    {
        private async Task SeedTestData(SSDbContext dbContext)
        {
            dbContext.Skips.AddRange(new List<Models.Skip>
                {
                    new Models.Skip { Id = 1, Name = "2", Size = Models.SkipSize.Small, Notes = "Some Notes", Rented = true, Deleted = false },
                    new Models.Skip { Id = 2, Name = "5", Size = Models.SkipSize.Large, Rented = false, Deleted = false },
                    new Models.Skip { Id = 3, Name = "9", Size = Models.SkipSize.Small, Rented = false, Deleted = false }
                });

            await dbContext.SaveChangesAsync();
        }

        [Fact]
        public async Task CreateNewSkip_Success()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                var newSkip = new Models.Skip { Id = 4, Name = "13", Size = Models.SkipSize.Small, Rented = false, Deleted = false };

                var controller = new SkipController(new SkipService(dbContext));

                // Act
                var actionResult = await controller.Create(newSkip);

                // Assert
                var result = actionResult.Result as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal(StatusCodes.Status200OK, result.StatusCode);

                var returnedSkip = result.Value as Models.Skip;
                Assert.NotNull(returnedSkip);
                Assert.Equal(newSkip.Id, returnedSkip.Id);
                Assert.Equal(newSkip.Name, returnedSkip.Name);
                Assert.Equal(newSkip.Size, returnedSkip.Size);
                Assert.Equal(newSkip.Notes, returnedSkip.Notes);
                Assert.Equal(newSkip.Rented, returnedSkip.Rented);
                Assert.Equal(newSkip.Deleted, returnedSkip.Deleted);
            }
        }

        [Fact]
        public async Task GetPaginated_Success_NoFilter()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);
                var controller = new SkipController(new SkipService(dbContext));

                // Act
                var actionResult = await controller.GetPaginated(page: 1);

                // Assert
                var result = actionResult.Result as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal(StatusCodes.Status200OK, result.StatusCode);

                var returnedData = result.Value as PaginatedList<Models.Skip>;
                Assert.NotNull(returnedData);
                Assert.Equal(3, returnedData.TotalCount); // Total count should be 3 from seed data
                Assert.Equal(1, returnedData.CurrentPage);
                Assert.Equal(15, returnedData.PageSize);
                Assert.False(returnedData.HasNext); // Should be false as all items fit in first page
            }
        }

        [Fact]
        public async Task GetPaginated_WithFilter_Booked()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);
                var controller = new SkipController(new SkipService(dbContext));

                // Act
                var actionResult = await controller.GetPaginated(page: 1, filter: "Booked");

                // Assert
                var result = actionResult.Result as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal(StatusCodes.Status200OK, result.StatusCode);

                var returnedData = result.Value as PaginatedList<Models.Skip>;
                Assert.NotNull(returnedData);
                Assert.Single(returnedData.Items); // Should only find one rented skip
                Assert.True(returnedData.Items[0].Rented);
            }
        }

        [Fact]
        public async Task GetPaginated_WithFilter_Available()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);
                var controller = new SkipController(new SkipService(dbContext));

                // Act
                var actionResult = await controller.GetPaginated(page: 1, filter: "Available");

                // Assert
                var result = actionResult.Result as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal(StatusCodes.Status200OK, result.StatusCode);

                var returnedData = result.Value as PaginatedList<Models.Skip>;
                Assert.NotNull(returnedData);
                Assert.Equal(2, returnedData.Items.Count); // Should find two available skips
                Assert.All(returnedData.Items, skip => Assert.False(skip.Rented));
            }
        }

        [Fact]
        public async Task GetPaginated_InvalidPage_ReturnsFirstPage()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);
                var controller = new SkipController(new SkipService(dbContext));

                // Act
                var actionResult = await controller.GetPaginated(page: -1);

                // Assert
                var result = actionResult.Result as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal(StatusCodes.Status200OK, result.StatusCode);

                var returnedData = result.Value as PaginatedList<Models.Skip>;
                Assert.NotNull(returnedData);
                Assert.Equal(1, returnedData.CurrentPage);
            }
        }

        [Fact]
        public async Task GetAllSkips_Success()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);

                var controller = new SkipController(new SkipService(dbContext));

                // Act
                var actionResult = await controller.GetAll();

                // Assert
                var result = actionResult.Result as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal(StatusCodes.Status200OK, result.StatusCode);

                var returnedSkips = result.Value as List<Models.Skip>;
                Assert.NotNull(returnedSkips);
                Assert.Equal(3, returnedSkips.Count);
            }
        }

        [Fact]
        public async Task GetAvailableSkips_Success()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);
                var expectedSkips = dbContext.Skips.Where(s => s.Rented == false).ToList();

                var controller = new SkipController(new SkipService(dbContext));

                // Act
                var actionResult = await controller.GetAvailable();

                // Assert
                var result = actionResult.Result as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal(StatusCodes.Status200OK, result.StatusCode);

                var returnedSkips = result.Value as List<Models.Skip>;
                Assert.NotNull(returnedSkips);
                Assert.Equal(expectedSkips.Count, returnedSkips.Count);
            }
        }

        [Fact]
        public async Task GetSkipById_Success()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);
                var expectedSkipId = 2;
                var expectedSkip = dbContext.Skips.Find(expectedSkipId);

                var controller = new SkipController(new SkipService(dbContext));

                // Act
                var actionResult = await controller.Get(expectedSkipId);

                // Assert
                var result = actionResult.Result as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal(StatusCodes.Status200OK, result.StatusCode);

                var returnedSkip = result.Value as Models.Skip;
                Assert.NotNull(returnedSkip);
                Assert.Equal(expectedSkip?.Id, returnedSkip.Id);
                Assert.Equal(expectedSkip?.Name, returnedSkip.Name);
                Assert.Equal(expectedSkip?.Size, returnedSkip.Size);
                Assert.Equal(expectedSkip?.Notes, returnedSkip.Notes);
                Assert.Equal(expectedSkip?.Rented, returnedSkip.Rented);
                Assert.Equal(expectedSkip?.Deleted, returnedSkip.Deleted);
            }
        }

        [Fact]
        public async Task UpdateSkip_Success()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                // Arrange 
                await SeedTestData(dbContext);

                var updatedSkipId = 3;

                var controller = new SkipController(new SkipService(dbContext));

                // Act
                var skipUpdates = new Models.Skip { Id = 3, Name = "9", Size = Models.SkipSize.Small, Rented = false, Deleted = true };

                var actionResult = await controller.Update(updatedSkipId, skipUpdates);

                // Assert
                var result = actionResult.Result as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal(StatusCodes.Status200OK, result.StatusCode);

                var returnedSkip = result.Value as Models.Skip;
                Assert.NotNull(returnedSkip);

                var updatedSkip = dbContext.Skips.Find(updatedSkipId);
                if (updatedSkip != null)
                {
                    Assert.Equal(updatedSkip?.Id, returnedSkip.Id);
                    Assert.Equal(updatedSkip?.Name, returnedSkip.Name);
                    Assert.Equal(updatedSkip?.Size, returnedSkip.Size);
                    Assert.Equal(updatedSkip?.Notes, returnedSkip.Notes);
                    Assert.Equal(updatedSkip?.Rented, returnedSkip.Rented);
                    Assert.Equal(updatedSkip?.Deleted, returnedSkip.Deleted);
                }
            }
        }
    }
}