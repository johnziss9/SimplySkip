namespace SimplySkip.Tests.Skip
{
    public class SkipServiceTests
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

                var service = new SkipService(dbContext);

                // Act
                var result = await service.CreateSkip(newSkip);

                // Assert
                Assert.NotNull(result.Data);
                Assert.Equal(newSkip.Id, result.Data.Id);
                Assert.Equal(newSkip.Name, result.Data.Name);
                Assert.Equal(newSkip.Size, result.Data.Size);
                Assert.Equal(newSkip.Notes, result.Data.Notes);
                Assert.Equal(newSkip.Rented, result.Data.Rented);
                Assert.Equal(newSkip.Deleted, result.Data.Deleted);
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

                var service = new SkipService(dbContext);

                // Act
                var result = await service.GetAllSkips();

                // Assert
                Assert.NotNull(result.Data);
                Assert.Equal(3, result.Data.Count);
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

                var service = new SkipService(dbContext);

                // Act
                var result = await service.GetAvailableSkips();

                // Assert
                Assert.NotNull(result.Data);
                Assert.Equal(expectedSkips.Count, result.Data.Count);
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

                var service = new SkipService(dbContext);

                // Act
                var result = await service.GetSkipById(expectedSkipId);

                // Assert
                Assert.NotNull(result.Data);
                Assert.Equal(expectedSkip?.Id, result.Data.Id);
                Assert.Equal(expectedSkip?.Name, result.Data.Name);
                Assert.Equal(expectedSkip?.Size, result.Data.Size);
                Assert.Equal(expectedSkip?.Notes, result.Data.Notes);
                Assert.Equal(expectedSkip?.Rented, result.Data.Rented);
                Assert.Equal(expectedSkip?.Deleted, result.Data.Deleted);
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

                var service = new SkipService(dbContext);

                // Act
                var skipUpdates = new Models.Skip { Id = 3, Name = "9", Size = Models.SkipSize.Small, Rented = false, Deleted = true };

                var result = await service.UpdateSkip(updatedSkipId, skipUpdates);

                // Assert
                Assert.NotNull(result.Data);
                
                var updatedSkip = dbContext.Skips.Find(updatedSkipId);
                if (updatedSkip != null)
                {
                    Assert.Equal(updatedSkip?.Id, result.Data.Id);
                    Assert.Equal(updatedSkip?.Name, result.Data.Name);
                    Assert.Equal(updatedSkip?.Size, result.Data.Size);
                    Assert.Equal(updatedSkip?.Notes, result.Data.Notes);
                    Assert.Equal(updatedSkip?.Rented, result.Data.Rented);
                    Assert.Equal(updatedSkip?.Deleted, result.Data.Deleted);
                    }
            }
        }
    }
}