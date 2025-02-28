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
                    new Models.Skip { Id = 3, Name = "9", Size = Models.SkipSize.Small, Rented = false, Deleted = false },
                    new Models.Skip { Id = 4, Name = "10", Size = Models.SkipSize.Small, Rented = false, Deleted = true }
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
        public async Task GetSkipsWithPagination_Success_NoFilter()
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
                var result = await service.GetSkipsWithPagination(1, 15, null);

                // Assert
                Assert.True(result.IsSuccess);
                Assert.NotNull(result.Data);
                Assert.Equal(3, result.Data.TotalCount); // Only non-deleted skips
                Assert.Equal(1, result.Data.CurrentPage);
                Assert.Equal(15, result.Data.PageSize);
                Assert.Equal(3, result.Data.Items.Count);
                Assert.False(result.Data.HasNext);

                Assert.NotNull(result.Data.Counts);
                Assert.Equal(3, result.Data.Counts.All); // Should only count non-deleted
                Assert.Equal(1, result.Data.Counts.Rented);
                Assert.Equal(2, result.Data.Counts.Available);
                
                // Verify no deleted skips are returned
                Assert.False(result?.Data.Items.Any(s => s.Deleted));
            }
        }

        [Fact]
        public async Task GetSkipsWithPagination_Success_WithFilter()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);
                var service = new SkipService(dbContext);

                // Test each filter type
                var filters = new[] { "Booked", "Available" };
                var expectedCounts = new Dictionary<string, int>
                {
                    { "Booked", 1 },    // One rented skip
                    { "Available", 2 }   // Two available skips
                };

                foreach (var filter in filters)
                {
                    // Act
                    var result = await service.GetSkipsWithPagination(1, 15, filter);

                    // Assert
                    Assert.True(result.IsSuccess);
                    Assert.NotNull(result.Data);
                    Assert.Equal(expectedCounts[filter], result.Data.Items.Count);

                    // Verify the filter is working correctly
                    foreach (var skip in result.Data.Items)
                    {
                        if (filter == "Booked")
                            Assert.True(skip.Rented);
                        else
                            Assert.False(skip.Rented);
                    }
                }
            }
        }

        [Fact]
        public async Task GetSkipsWithPagination_EmptyDatabase()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                var service = new SkipService(dbContext);

                // Act
                var result = await service.GetSkipsWithPagination(1, 15, null);

                // Assert
                Assert.True(result.IsSuccess);
                Assert.NotNull(result.Data);
                Assert.Empty(result.Data.Items);
                Assert.Equal(0, result.Data.TotalCount);
                Assert.False(result.Data.HasNext);

                Assert.NotNull(result.Data.Counts);
                Assert.Equal(0, result.Data.Counts.All);
                Assert.Equal(0, result.Data.Counts.Rented);
                Assert.Equal(0, result.Data.Counts.Available);
            }
        }

        [Fact]
        public async Task GetSkipsWithPagination_CountsRemainConsistentWithFilters()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);
                var service = new SkipService(dbContext);

                var initialResult = await service.GetSkipsWithPagination(1, 15, null);
                var initialCounts = initialResult?.Data?.Counts;

                var filters = new[] { "Booked", "Available" };
                foreach (var filter in filters)
                {
                    // Act
                    var result = await service.GetSkipsWithPagination(1, 15, filter);

                    // Assert
                    Assert.NotNull(result?.Data?.Counts);
                    Assert.Equal(initialCounts?.All, result.Data.Counts.All);
                    Assert.Equal(initialCounts?.Rented, result.Data.Counts.Rented);
                    Assert.Equal(initialCounts?.Available, result.Data.Counts.Available);
                    
                    Assert.Equal(3, result.Data.Counts.All); // Total non-deleted skips
                    
                    // Verify no deleted skips are returned in filtered items
                    Assert.False(result?.Data.Items.Any(s => s.Deleted));
                }
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
                var expectedSkips = dbContext.Skips.Where(s => s.Rented == false && s.Deleted == false).ToList();

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

        [Fact]
        public async Task GetSkipsWithPagination_ExcludesDeletedSkipsFromCounts()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);
                
                var totalSkipsInDb = await dbContext.Skips.CountAsync();
                var deletedSkipsInDb = await dbContext.Skips.CountAsync(s => s.Deleted);
                var nonDeletedSkipsInDb = await dbContext.Skips.CountAsync(s => !s.Deleted);
                
                Assert.Equal(4, totalSkipsInDb);
                Assert.Equal(1, deletedSkipsInDb);
                Assert.Equal(3, nonDeletedSkipsInDb);
                
                var service = new SkipService(dbContext);

                // Act
                var result = await service.GetSkipsWithPagination(1, 15, null);

                // Assert
                Assert.True(result.IsSuccess);
                Assert.NotNull(result.Data);
                Assert.NotNull(result.Data.Counts);
                
                Assert.Equal(nonDeletedSkipsInDb, result.Data.Counts.All);
                Assert.NotEqual(totalSkipsInDb, result.Data.Counts.All); // Should not match total count
            }
        }
    }
}