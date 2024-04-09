namespace SimplySkip.Tests.AuditLogs
{
    public class AuditLogServiceTests
    {
        private async Task SeedTestData(SSDbContext dbContext)
        {
            dbContext.AuditLogs.AddRange(new List<Models.AuditLog>
                {
                    new Models.AuditLog { Id = 1, UserId = "a89e9ae6-2064-4eb9-9794-1d72cb496df6", Username = "user1", Action = "New Customer Added.", Timestamp = DateTime.UtcNow },
                    new Models.AuditLog { Id = 2, UserId = "cc7fcf1f-563f-4fb3-be40-f6d3c7952044", Username = "user2", Action = "Customer Updated.", Timestamp = DateTime.UtcNow.AddDays(-3) },
                    new Models.AuditLog { Id = 3, UserId = "a89e9ae6-2064-4eb9-9794-1d72cb496df6", Username = "user1", Action = "Customer Updated.", Timestamp = DateTime.UtcNow.AddDays(-1) }
                });

            await dbContext.SaveChangesAsync();
        }

        [Fact]
        public async Task CreateNewAuditLog_Success()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                var newAuditLog = new Models.AuditLog { Id = 4, UserId = "cc7fcf1f-563f-4fb3-be40-f6d3c7952044", Username = "user2", Action = "Booking Cancelled.", Timestamp = DateTime.UtcNow };

                var service = new AuditLogService(dbContext);

                // Act
                var result = await service.CreateAuditLog(newAuditLog);

                // Assert
                Assert.NotNull(result.Data);
                Assert.Equal(newAuditLog.Id, result.Data.Id);
                Assert.Equal(newAuditLog.UserId, result.Data.UserId);
                Assert.Equal(newAuditLog.Username, result.Data.Username);
                Assert.Equal(newAuditLog.Action, result.Data.Action);
                Assert.Equal(newAuditLog.Timestamp, result.Data.Timestamp);
            }
        }

        [Fact]
        public async Task GetAllAuditLogs_Success()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);

                var service = new AuditLogService(dbContext);

                // Act
                var result = await service.GetAllAuditLogs();

                // Assert
                Assert.NotNull(result.Data);
                Assert.Equal(3, result.Data.Count);
            }
        }

        [Fact]
        public async Task GetAuditLogById_Success()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);
                var expectedAuditLogId = 2;
                var expectedAuditLog = dbContext.AuditLogs.Find(expectedAuditLogId);

                var service = new AuditLogService(dbContext);

                // Act
                var result = await service.GetAuditLogById(expectedAuditLogId);

                // Assert
                Assert.NotNull(result.Data);
                Assert.Equal(expectedAuditLog?.Id, result.Data.Id);
                Assert.Equal(expectedAuditLog?.UserId, result.Data.UserId);
                Assert.Equal(expectedAuditLog?.Username, result.Data.Username);
                Assert.Equal(expectedAuditLog?.Action, result.Data.Action);
                Assert.Equal(expectedAuditLog?.Timestamp, result.Data.Timestamp);
            }
        }

        [Fact]
        public async Task GetLatestAuditLogByUserId_Success()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);
                var expectedUserId = "a89e9ae6-2064-4eb9-9794-1d72cb496df6";
                var expectedAuditLog = dbContext.AuditLogs
                    .Where(al => al.UserId == expectedUserId)
                    .OrderByDescending(al => al.Timestamp)
                    .FirstOrDefault();

                var service = new AuditLogService(dbContext);

                // Act
                var result = await service.GetLatestAuditLogByUserId(expectedUserId);

                // Assert
                Assert.NotNull(result.Data);
                Assert.Equal(expectedAuditLog?.Id, result.Data.Id);
                Assert.Equal(expectedAuditLog?.UserId, result.Data.UserId);
                Assert.Equal(expectedAuditLog?.Username, result.Data.Username);
                Assert.Equal(expectedAuditLog?.Action, result.Data.Action);
                Assert.Equal(expectedAuditLog?.Timestamp, result.Data.Timestamp);
            }
        }
    }
}