namespace SimplySkip.Tests.AuditLogs
{
    public class AuditLogControllerTests
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

                var controller = new AuditLogController(new AuditLogService(dbContext));

                // Act
                var actionResult = await controller.Create(newAuditLog);

                // Assert
                var result = actionResult.Result as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal(StatusCodes.Status200OK, result.StatusCode);

                var returnedAuditLog = result.Value as Models.AuditLog;
                Assert.NotNull(returnedAuditLog);
                Assert.Equal(newAuditLog.Id, returnedAuditLog.Id);
                Assert.Equal(newAuditLog.UserId, returnedAuditLog.UserId);
                Assert.Equal(newAuditLog.Username, returnedAuditLog.Username);
                Assert.Equal(newAuditLog.Action, returnedAuditLog.Action);
                Assert.Equal(newAuditLog.Timestamp, returnedAuditLog.Timestamp);
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

                var controller = new AuditLogController(new AuditLogService(dbContext));

                // Act
                var actionResult = await controller.GetAll();

                // Assert
                var result = actionResult.Result as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal(StatusCodes.Status200OK, result.StatusCode);

                var returnedAuditLogs = result.Value as List<Models.AuditLog>;
                Assert.NotNull(returnedAuditLogs);
                Assert.Equal(3, returnedAuditLogs.Count);
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

                var controller = new AuditLogController(new AuditLogService(dbContext));

                // Act
                var actionResult = await controller.Get(expectedAuditLogId);

                // Assert
                var result = actionResult.Result as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal(StatusCodes.Status200OK, result.StatusCode);

                var returnedAuditLog = result.Value as Models.AuditLog;
                Assert.NotNull(returnedAuditLog);
                Assert.Equal(expectedAuditLog?.Id, returnedAuditLog.Id);
                Assert.Equal(expectedAuditLog?.UserId, returnedAuditLog.UserId);
                Assert.Equal(expectedAuditLog?.Username, returnedAuditLog.Username);
                Assert.Equal(expectedAuditLog?.Action, returnedAuditLog.Action);
                Assert.Equal(expectedAuditLog?.Timestamp, returnedAuditLog.Timestamp);
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

                var controller = new AuditLogController(new AuditLogService(dbContext));

                // Act
                var actionResult = await controller.GetLatestByUserId(expectedUserId);

                // Assert
                var result = actionResult.Result as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal(StatusCodes.Status200OK, result.StatusCode);

                var returnedAuditLog = result.Value as Models.AuditLog;
                Assert.NotNull(returnedAuditLog);
                Assert.Equal(expectedAuditLog?.Id, returnedAuditLog.Id);
                Assert.Equal(expectedAuditLog?.UserId, returnedAuditLog.UserId);
                Assert.Equal(expectedAuditLog?.Username, returnedAuditLog.Username);
                Assert.Equal(expectedAuditLog?.Action, returnedAuditLog.Action);
                Assert.Equal(expectedAuditLog?.Timestamp, returnedAuditLog.Timestamp);
            }
        }
    }
}