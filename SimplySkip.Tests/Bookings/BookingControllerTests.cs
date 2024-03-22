namespace SimplySkip.Tests.Bookings
{
    public class BookingControllerTests
    {
        private async Task SeedTestData(SSDbContext dbContext)
        {
            dbContext.Bookings.AddRange(new List<Models.Booking>
                {
                    new Models.Booking { Id = 1, SkipId = 2, Address = "23 Test Address", HireDate = DateTime.UtcNow.AddDays(-5), ReturnDate = DateTime.UtcNow, Notes = "Some Notes", Returned = false, Paid = false, Cancelled = false, CustomerId = 2 },
                    new Models.Booking { Id = 2, SkipId = 3, Address = "87 Test Address", HireDate = DateTime.UtcNow.AddDays(-15), ReturnDate = DateTime.UtcNow.AddDays(-3), Returned = true, Paid = true, Cancelled = false, CustomerId = 1 },
                    new Models.Booking { Id = 3, SkipId = 5, Address = "99 Test Address", HireDate = DateTime.UtcNow.AddDays(-12), ReturnDate = DateTime.UtcNow, Returned = false, Paid = false, Cancelled = true, CustomerId = 1 }
                });

            await dbContext.SaveChangesAsync();
        }

        [Fact]
        public async Task CreateNewBooking_Success()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                var newBooking = new Models.Booking { Id = 4, SkipId = 6, Address = "92 Test Address", HireDate = DateTime.UtcNow.AddDays(-10), ReturnDate = DateTime.UtcNow.AddDays(-5), Returned = true, Paid = false, Cancelled = false, CustomerId = 3 };

                var controller = new BookingController(new BookingService(dbContext));

                // Act
                var actionResult = await controller.Create(newBooking);

                // Assert
                var result = actionResult.Result as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal(StatusCodes.Status200OK, result.StatusCode);

                var returnedBooking = result.Value as Models.Booking;
                Assert.NotNull(returnedBooking);
                Assert.Equal(newBooking.Id, returnedBooking.Id);
                Assert.Equal(newBooking.SkipId, returnedBooking.SkipId);
                Assert.Equal(newBooking.Address, returnedBooking.Address);
                Assert.Equal(newBooking.HireDate, returnedBooking.HireDate);
                Assert.Equal(newBooking.ReturnDate, returnedBooking.ReturnDate);
                Assert.Equal(newBooking.Notes, returnedBooking.Notes);
                Assert.Equal(newBooking.Returned, returnedBooking.Returned);
                Assert.Equal(newBooking.Paid, returnedBooking.Paid);
                Assert.Equal(newBooking.Cancelled, returnedBooking.Cancelled);
            }
        }

        [Fact]
        public async Task GetAllBookings_Success()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);

                var controller = new BookingController(new BookingService(dbContext));

                // Act
                var actionResult = await controller.GetAll();

                // Assert
                var result = actionResult.Result as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal(StatusCodes.Status200OK, result.StatusCode);

                var returnedBookings = result.Value as List<Models.Booking>;
                Assert.NotNull(returnedBookings);
                Assert.Equal(3, returnedBookings.Count);
            }
        }

        [Fact]
        public async Task GetBookingsByCustomerId_Success()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);
                var expectedCustomerId = 1;
                var expectedBookings = dbContext.Bookings.Where(b => b.CustomerId == expectedCustomerId).ToList();

                var controller = new BookingController(new BookingService(dbContext));

                // Act
                var actionResult = await controller.GetByCustomerId(expectedCustomerId);

                // Assert
                var result = actionResult.Result as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal(StatusCodes.Status200OK, result.StatusCode);

                var returnedBookings = result.Value as List<Models.Booking>;
                Assert.NotNull(returnedBookings);
                Assert.Equal(expectedBookings.Count, returnedBookings.Count);

                foreach (var expectedBooking in expectedBookings)
                {
                    var matchingBooking = returnedBookings.FirstOrDefault(b => b.Id == expectedBooking.Id);
                    Assert.NotNull(matchingBooking);
                    Assert.Equal(expectedBooking?.Id, matchingBooking.Id);
                    Assert.Equal(expectedBooking?.SkipId, matchingBooking.SkipId);
                    Assert.Equal(expectedBooking?.Address, matchingBooking.Address);
                    Assert.Equal(expectedBooking?.HireDate, matchingBooking.HireDate);
                    Assert.Equal(expectedBooking?.ReturnDate, matchingBooking.ReturnDate);
                    Assert.Equal(expectedBooking?.Notes, matchingBooking.Notes);
                    Assert.Equal(expectedBooking?.Returned, matchingBooking.Returned);
                    Assert.Equal(expectedBooking?.Paid, matchingBooking.Paid);
                    Assert.Equal(expectedBooking?.Cancelled, matchingBooking.Cancelled);
                }
            }
        }

        [Fact]
        public async Task GetBookingById_Success()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);
                var expectedBookingId = 2;
                var expectedBooking = dbContext.Bookings.Find(expectedBookingId);

                var controller = new BookingController(new BookingService(dbContext));

                // Act
                var actionResult = await controller.Get(expectedBookingId);

                // Assert
                var result = actionResult.Result as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal(StatusCodes.Status200OK, result.StatusCode);

                var returnedBooking = result.Value as Models.Booking;
                Assert.NotNull(returnedBooking);
                Assert.Equal(expectedBooking?.Id, returnedBooking.Id);
                Assert.Equal(expectedBooking?.SkipId, returnedBooking.SkipId);
                Assert.Equal(expectedBooking?.Address, returnedBooking.Address);
                Assert.Equal(expectedBooking?.HireDate, returnedBooking.HireDate);
                Assert.Equal(expectedBooking?.ReturnDate, returnedBooking.ReturnDate);
                Assert.Equal(expectedBooking?.Notes, returnedBooking.Notes);
                Assert.Equal(expectedBooking?.Returned, returnedBooking.Returned);
                Assert.Equal(expectedBooking?.Paid, returnedBooking.Paid);
                Assert.Equal(expectedBooking?.Cancelled, returnedBooking.Cancelled);
            }
        }

        [Fact]
        public async Task GetBookingBySkipId_Success()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);
                var expectedSkipId = 3;
                var expectedBooking = dbContext.Bookings.FirstOrDefault(b => b.SkipId == expectedSkipId);

                var controller = new BookingController(new BookingService(dbContext));

                // Act
                var actionResult = await controller.GetBySkipId(expectedSkipId);

                // Assert
                var result = actionResult.Result as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal(StatusCodes.Status200OK, result.StatusCode);

                var returnedBooking = result.Value as Models.Booking;
                Assert.NotNull(returnedBooking);
                Assert.Equal(expectedBooking?.Id, returnedBooking.Id);
                Assert.Equal(expectedBooking?.SkipId, returnedBooking.SkipId);
                Assert.Equal(expectedBooking?.Address, returnedBooking.Address);
                Assert.Equal(expectedBooking?.HireDate, returnedBooking.HireDate);
                Assert.Equal(expectedBooking?.ReturnDate, returnedBooking.ReturnDate);
                Assert.Equal(expectedBooking?.Notes, returnedBooking.Notes);
                Assert.Equal(expectedBooking?.Returned, returnedBooking.Returned);
                Assert.Equal(expectedBooking?.Paid, returnedBooking.Paid);
                Assert.Equal(expectedBooking?.Cancelled, returnedBooking.Cancelled);
            }
        }

        [Fact]
        public async Task UpdateBooking_Success()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                // Arrange 
                await SeedTestData(dbContext);

                var updatedBookingId = 1;

                var controller = new BookingController(new BookingService(dbContext));

                // Act
                var bookingUpdates = new Models.Booking { Id = 1, SkipId = 2, Address = "23 Test Address", HireDate = DateTime.UtcNow.AddDays(-5), ReturnDate = DateTime.UtcNow, Notes = "Some Notes", Returned = true, Paid = false, Cancelled = false, CustomerId = 2 };

                var actionResult = await controller.Update(updatedBookingId, bookingUpdates);

                // Assert
                var result = actionResult.Result as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal(StatusCodes.Status200OK, result.StatusCode);

                var returnedBooking = result.Value as Models.Booking;
                Assert.NotNull(returnedBooking);
                
                var updatedBooking = dbContext.Bookings.Find(updatedBookingId);
                if (updatedBooking != null)
                {
                    Assert.Equal(updatedBooking?.Id, returnedBooking.Id);
                    Assert.Equal(updatedBooking?.SkipId, returnedBooking.SkipId);
                    Assert.Equal(updatedBooking?.Address, returnedBooking.Address);
                    Assert.Equal(updatedBooking?.HireDate, returnedBooking.HireDate);
                    Assert.Equal(updatedBooking?.ReturnDate, returnedBooking.ReturnDate);
                    Assert.Equal(updatedBooking?.Notes, returnedBooking.Notes);
                    Assert.Equal(updatedBooking?.Returned, returnedBooking.Returned);
                    Assert.Equal(updatedBooking?.Paid, returnedBooking.Paid);
                    Assert.Equal(updatedBooking?.Cancelled, returnedBooking.Cancelled);
                    }
            }
        }
    }
}