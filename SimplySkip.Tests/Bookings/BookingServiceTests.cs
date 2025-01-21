namespace SimplySkip.Tests.Bookings
{
    public class BookingServiceTests
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

                var service = new BookingService(dbContext);

                // Act
                var result = await service.CreateBooking(newBooking);

                // Assert
                Assert.NotNull(result.Data);
                Assert.Equal(newBooking.Id, result.Data.Id);
                Assert.Equal(newBooking.SkipId, result.Data.SkipId);
                Assert.Equal(newBooking.Address, result.Data.Address);
                Assert.Equal(newBooking.HireDate, result.Data.HireDate);
                Assert.Equal(newBooking.ReturnDate, result.Data.ReturnDate);
                Assert.Equal(newBooking.Notes, result.Data.Notes);
                Assert.Equal(newBooking.Returned, result.Data.Returned);
                Assert.Equal(newBooking.Paid, result.Data.Paid);
                Assert.Equal(newBooking.Cancelled, result.Data.Cancelled);
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

                var service = new BookingService(dbContext);

                // Act
                var result = await service.GetAllBookings();

                // Assert
                Assert.NotNull(result.Data);
                Assert.Equal(3, result.Data.Count);
            }
        }

        [Fact]
        public async Task GetBookingsWithPagination_Success_NoFilter()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);
                var service = new BookingService(dbContext);

                // Act
                var result = await service.GetBookingsWithPagination(1, 15, null);

                // Assert
                Assert.True(result.IsSuccess);
                Assert.NotNull(result.Data);
                Assert.Equal(3, result.Data.TotalCount);
                Assert.Equal(1, result.Data.CurrentPage);
                Assert.Equal(15, result.Data.PageSize);
                Assert.Equal(3, result.Data.Items.Count);
                Assert.False(result.Data.HasNext);

                Assert.NotNull(result.Data.Counts);
                Assert.Equal(3, result.Data.Counts.All);
                Assert.Equal(1, result.Data.Counts.Active);
                Assert.Equal(1, result.Data.Counts.Past);
                Assert.Equal(1, result.Data.Counts.Cancelled);
                Assert.Equal(0, result.Data.Counts.Unpaid);
            }
        }

        [Fact]
        public async Task GetBookingsWithPagination_Success_WithFilter()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);
                var service = new BookingService(dbContext);

                // Test each filter type
                var filters = new[] { "Active", "Unpaid", "Past", "Cancelled" };
                var expectedCounts = new Dictionary<string, int>
        {
            { "Active", 1 },    // One active booking
            { "Past", 1 },      // One completed booking
            { "Cancelled", 1 }, // One cancelled booking
            { "Unpaid", 0 }     // No unpaid bookings that match criteria
        };

                foreach (var filter in filters)
                {
                    // Act
                    var result = await service.GetBookingsWithPagination(1, 15, filter);

                    // Assert
                    Assert.True(result.IsSuccess);
                    Assert.NotNull(result.Data);
                    Assert.Equal(expectedCounts[filter], result.Data.Items.Count);

                    // Verify the filter is working correctly
                    foreach (var booking in result.Data.Items)
                    {
                        switch (filter)
                        {
                            case "Active":
                                Assert.False(booking.Returned);
                                Assert.False(booking.Cancelled);
                                break;
                            case "Unpaid":
                                Assert.True(booking.Returned);
                                Assert.False(booking.Paid);
                                Assert.False(booking.Cancelled);
                                break;
                            case "Past":
                                Assert.True(booking.Returned);
                                Assert.True(booking.Paid);
                                Assert.False(booking.Cancelled);
                                break;
                            case "Cancelled":
                                Assert.True(booking.Cancelled);
                                break;
                        }
                    }
                }
            }
        }

        [Fact]
        public async Task GetBookingsWithPagination_EmptyDatabase()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                var service = new BookingService(dbContext);

                // Act
                var result = await service.GetBookingsWithPagination(1, 15, null);

                // Assert
                Assert.True(result.IsSuccess);
                Assert.NotNull(result.Data);
                Assert.Empty(result.Data.Items);
                Assert.Equal(0, result.Data.TotalCount);
                Assert.False(result.Data.HasNext);

                Assert.NotNull(result.Data.Counts);
                Assert.Equal(0, result.Data.Counts.All);
                Assert.Equal(0, result.Data.Counts.Active);
                Assert.Equal(0, result.Data.Counts.Past);
                Assert.Equal(0, result.Data.Counts.Cancelled);
                Assert.Equal(0, result.Data.Counts.Unpaid);
            }
        }

        [Fact]
        public async Task GetBookingsWithPagination_CountsRemainConsistentWithFilters()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);
                var service = new BookingService(dbContext);

                // Get initial counts
                var initialResult = await service.GetBookingsWithPagination(1, 15, null);
                var initialCounts = initialResult?.Data?.Counts;

                // Test each filter
                var filters = new[] { "Active", "Unpaid", "Past", "Cancelled" };
                foreach (var filter in filters)
                {
                    // Act
                    var result = await service.GetBookingsWithPagination(1, 15, filter);

                    // Assert
                    Assert.NotNull(result?.Data?.Counts);
                    // Verify counts remain the same regardless of filter
                    Assert.Equal(initialCounts?.All, result.Data.Counts.All);
                    Assert.Equal(initialCounts?.Active, result.Data.Counts.Active);
                    Assert.Equal(initialCounts?.Past, result.Data.Counts.Past);
                    Assert.Equal(initialCounts?.Cancelled, result.Data.Counts.Cancelled);
                    Assert.Equal(initialCounts?.Unpaid, result.Data.Counts.Unpaid);
                }
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

                var service = new BookingService(dbContext);

                // Act
                var result = await service.GetBookingsByCustomerId(expectedCustomerId);

                // Assert
                Assert.NotNull(result.Data);
                Assert.Equal(expectedBookings.Count, result.Data.Count);

                foreach (var expectedBooking in expectedBookings)
                {
                    var matchingBooking = result.Data.FirstOrDefault(b => b.Id == expectedBooking.Id);
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

                var service = new BookingService(dbContext);

                // Act
                var result = await service.GetBookingById(expectedBookingId);

                // Assert
                Assert.NotNull(result.Data);
                Assert.Equal(expectedBooking?.Id, result.Data.Id);
                Assert.Equal(expectedBooking?.SkipId, result.Data.SkipId);
                Assert.Equal(expectedBooking?.Address, result.Data.Address);
                Assert.Equal(expectedBooking?.HireDate, result.Data.HireDate);
                Assert.Equal(expectedBooking?.ReturnDate, result.Data.ReturnDate);
                Assert.Equal(expectedBooking?.Notes, result.Data.Notes);
                Assert.Equal(expectedBooking?.Returned, result.Data.Returned);
                Assert.Equal(expectedBooking?.Paid, result.Data.Paid);
                Assert.Equal(expectedBooking?.Cancelled, result.Data.Cancelled);
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

                var service = new BookingService(dbContext);

                // Act
                var result = await service.GetBookingBySkipId(expectedSkipId);

                // Assert
                Assert.NotNull(result.Data);
                Assert.Equal(expectedBooking?.Id, result.Data.Id);
                Assert.Equal(expectedBooking?.SkipId, result.Data.SkipId);
                Assert.Equal(expectedBooking?.Address, result.Data.Address);
                Assert.Equal(expectedBooking?.HireDate, result.Data.HireDate);
                Assert.Equal(expectedBooking?.ReturnDate, result.Data.ReturnDate);
                Assert.Equal(expectedBooking?.Notes, result.Data.Notes);
                Assert.Equal(expectedBooking?.Returned, result.Data.Returned);
                Assert.Equal(expectedBooking?.Paid, result.Data.Paid);
                Assert.Equal(expectedBooking?.Cancelled, result.Data.Cancelled);
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

                var service = new BookingService(dbContext);

                // Act
                var bookingUpdates = new Models.Booking { Id = 1, SkipId = 2, Address = "23 Test Address", HireDate = DateTime.UtcNow.AddDays(-5), ReturnDate = DateTime.UtcNow, Notes = "Some Notes", Returned = true, Paid = false, Cancelled = false, CustomerId = 2 };

                var result = await service.UpdateBooking(updatedBookingId, bookingUpdates);

                // Assert
                Assert.NotNull(result.Data);

                var updatedBooking = dbContext.Bookings.Find(updatedBookingId);
                if (updatedBooking != null)
                {
                    Assert.Equal(updatedBooking?.Id, result.Data.Id);
                    Assert.Equal(updatedBooking?.SkipId, result.Data.SkipId);
                    Assert.Equal(updatedBooking?.Address, result.Data.Address);
                    Assert.Equal(updatedBooking?.HireDate, result.Data.HireDate);
                    Assert.Equal(updatedBooking?.ReturnDate, result.Data.ReturnDate);
                    Assert.Equal(updatedBooking?.Notes, result.Data.Notes);
                    Assert.Equal(updatedBooking?.Returned, result.Data.Returned);
                    Assert.Equal(updatedBooking?.Paid, result.Data.Paid);
                    Assert.Equal(updatedBooking?.Cancelled, result.Data.Cancelled);
                }
            }
        }
    }
}