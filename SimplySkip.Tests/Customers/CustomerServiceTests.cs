namespace SimplySkip.Tests.Customers
{
    public class CustomerServiceTests
    {
        private async Task SeedTestData(SSDbContext dbContext)
        {
            dbContext.Customers.AddRange(new List<Models.Customer>
                {
                    new Models.Customer { Id = 1, FirstName = "Tony", LastName = "Soprano", Phone = "23847238", Email = "tsoprano@gmail.com" },
                    new Models.Customer { Id = 2, FirstName = "Carmella", LastName = "Soprano", Phone = "348756348", Email = "csoprano@gmail.com" },
                    new Models.Customer { Id = 3, FirstName = "Meadow", LastName = "Soprano", Phone = "64645646", Email = "msoprano@gmail.com" }
                });

            await dbContext.SaveChangesAsync();
        }

        [Fact]
        public async Task GetAllCustomers_Success()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);

                var service = new CustomerService(dbContext);

                // Act
                var result = await service.GetAllCustomers();

                // Assert
                Assert.True(result.IsSuccess);
                Assert.NotNull(result.Data);
                Assert.Equal(3, result.Data.Count);
            }
        }

        [Fact]
        public async Task CreateNewCustomer_Success()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                var newCustomer = new Models.Customer { Id = 4, FirstName = "AJ", LastName = "Soprano", Phone = "5345345", Email = "ajsoprano@gmail.com" };

                var service = new CustomerService(dbContext);

                // Act
                var result = await service.CreateCustomer(newCustomer);

                // Assert
                Assert.True(result.IsSuccess);
                Assert.NotNull(result.Data);
                Assert.Equal(newCustomer.Id, result.Data.Id);
                Assert.Equal(newCustomer.FirstName, result.Data.FirstName);
                Assert.Equal(newCustomer.LastName, result.Data.LastName);
                Assert.Equal(newCustomer.Email, result.Data.Email);
                Assert.Equal(newCustomer.Phone, result.Data.Phone);
            }
        }

        [Fact]
        public async Task GetCustomerById_Success()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                // Arrange
                await SeedTestData(dbContext);
                var expectedCustomerId = 3;
                var expectedCustomer = dbContext.Customers.Find(expectedCustomerId);

                var service = new CustomerService(dbContext);

                // Act
                var result = await service.GetCustomerById(expectedCustomerId);

                // Assert
                Assert.NotNull(result.Data);
                Assert.Equal(expectedCustomer?.Id, result.Data.Id);
                Assert.Equal(expectedCustomer?.FirstName, result.Data.FirstName);
                Assert.Equal(expectedCustomer?.LastName, result.Data.LastName);
                Assert.Equal(expectedCustomer?.Email, result.Data.Email);
                Assert.Equal(expectedCustomer?.Phone, result.Data.Phone);
            }
        }

        [Fact]
        public async Task UpdateCustomer_Success()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                // Arrange 
                await SeedTestData(dbContext);

                var updatedCustomerId = 3;

                var service = new CustomerService(dbContext);

                // Act
                var customerUpdates = new Models.Customer { Id = 3, FirstName = "Meadow", LastName = "Soprano", Phone = "64645646", Email = "msoprano@gmail.com" };

                var result = await service.UpdateCustomer(updatedCustomerId, customerUpdates);

                // Assert
                Assert.NotNull(result.Data);

                var updatedCustomer = dbContext.Customers.Find(updatedCustomerId);
                if (updatedCustomer != null)
                {
                    Assert.Equal(updatedCustomer.Id, result.Data.Id);
                    Assert.Equal(updatedCustomer.FirstName, result.Data.FirstName);
                    Assert.Equal(updatedCustomer.LastName, result.Data.LastName);
                    Assert.Equal(updatedCustomer.Email, result.Data.Email);
                    Assert.Equal(updatedCustomer.Phone, result.Data.Phone);
                }
            }
        }

        [Fact]
        public async Task GetCustomersWithPagination_Success_NoSearch()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);
                var service = new CustomerService(dbContext);

                // Act
                var result = await service.GetCustomersWithPagination(1, 15, null);

                // Assert
                Assert.True(result.IsSuccess);
                Assert.NotNull(result.Data);
                Assert.Equal(3, result.Data.TotalCount);
                Assert.Equal(1, result.Data.CurrentPage);
                Assert.Equal(15, result.Data.PageSize);
                Assert.Equal(3, result.Data.Items.Count);
                Assert.False(result.Data.HasNext);
            }
        }

        [Fact]
        public async Task GetCustomersWithPagination_Success_WithSearch()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);
                var service = new CustomerService(dbContext);

                // Act
                var result = await service.GetCustomersWithPagination(1, 15, "Carmella");

                // Assert
                Assert.True(result.IsSuccess);
                Assert.NotNull(result.Data);
                Assert.Equal(1, result.Data.TotalCount);
                Assert.Single(result.Data.Items);
                Assert.Equal("Carmella", result.Data.Items[0].FirstName);
            }
        }

        [Fact]
        public async Task GetCustomersWithPagination_Success_EmptySearch()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);
                var service = new CustomerService(dbContext);

                // Act
                var result = await service.GetCustomersWithPagination(1, 15, "NonexistentCustomer");

                // Assert
                Assert.True(result.IsSuccess);
                Assert.NotNull(result.Data);
                Assert.Equal(0, result.Data.TotalCount);
                Assert.Empty(result.Data.Items);
            }
        }

        [Fact]
        public async Task GetCustomersWithPagination_Success_OrderByCreatedOn()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                var now = DateTime.UtcNow;
                dbContext.Customers.AddRange(new List<Models.Customer>
        {
            new Models.Customer
            {
                Id = 1,
                FirstName = "First",
                LastName = "Test",
                Phone = "1234567890",
                CreatedOn = now.AddDays(-2)
            },
            new Models.Customer
            {
                Id = 2,
                FirstName = "Second",
                LastName = "Test",
                Phone = "2234567890",
                CreatedOn = now.AddDays(-1)
            },
            new Models.Customer
            {
                Id = 3,
                FirstName = "Third",
                LastName = "Test",
                Phone = "3234567890",
                CreatedOn = now
            }
        });
                await dbContext.SaveChangesAsync();

                var service = new CustomerService(dbContext);

                // Act
                var result = await service.GetCustomersWithPagination(1, 15, null);

                // Assert
                Assert.True(result.IsSuccess);
                Assert.NotNull(result.Data);
                Assert.Equal(3, result.Data.Items.Count);
                Assert.Equal("Third", result.Data.Items[0].FirstName);
                Assert.Equal("Second", result.Data.Items[1].FirstName);
                Assert.Equal("First", result.Data.Items[2].FirstName);
            }
        }

        [Fact]
        public async Task CreateCustomer_DuplicatePhoneNumber_Fails()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);

                var service = new CustomerService(dbContext);
                var existingPhoneNumber = "23847238"; // Tony Soprano's phone from seed data

                var newCustomer = new Models.Customer
                {
                    Id = 4,
                    FirstName = "Christopher",
                    LastName = "Moltisanti",
                    Phone = existingPhoneNumber, // Duplicate phone number
                    Email = "cmoltisanti@gmail.com"
                };

                // Act
                var result = await service.CreateCustomer(newCustomer);

                // Assert
                Assert.False(result.IsSuccess);
                Assert.Equal(400, result.ErrorCode);
                Assert.Contains("Customer with this phone number already exists", result.ErrorMessage);
                Assert.Null(result.Data);

                // Verify the customer wasn't added to database
                var customerInDb = await dbContext.Customers.FindAsync(newCustomer.Id);
                Assert.Null(customerInDb);
            }
        }

        [Fact]
        public async Task CreateCustomer_UniquePhoneNumber_Succeeds()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);

                var service = new CustomerService(dbContext);

                var newCustomer = new Models.Customer
                {
                    Id = 4,
                    FirstName = "Christopher",
                    LastName = "Moltisanti",
                    Phone = "98765432", // Unique phone number
                    Email = "cmoltisanti@gmail.com"
                };

                // Act
                var result = await service.CreateCustomer(newCustomer);

                // Assert
                Assert.True(result.IsSuccess);
                Assert.NotNull(result.Data);
                Assert.Equal(0, result.ErrorCode);
                Assert.Null(result.ErrorMessage);
                Assert.Equal(newCustomer.Id, result.Data.Id);
                Assert.Equal(newCustomer.Phone, result.Data.Phone);

                // Verify customer was actually added to the database
                var savedCustomer = await dbContext.Customers.FindAsync(newCustomer.Id);
                Assert.NotNull(savedCustomer);
                Assert.Equal(newCustomer.Phone, savedCustomer.Phone);
            }
        }

        [Fact]
        public async Task CreateCustomer_PhoneNumberOfDeletedCustomer_Succeeds()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);

                var tonyCustomer = await dbContext.Customers.FindAsync(1);
                
                if (tonyCustomer != null)
                {
                    tonyCustomer.Deleted = true;
                    await dbContext.SaveChangesAsync();
                }

                var service = new CustomerService(dbContext);
                var deletedCustomerPhoneNumber = "23847238";

                var newCustomer = new Models.Customer
                {
                    Id = 4,
                    FirstName = "Christopher",
                    LastName = "Moltisanti",
                    Phone = deletedCustomerPhoneNumber,
                    Email = "cmoltisanti@gmail.com"
                };

                // Act
                var result = await service.CreateCustomer(newCustomer);

                // Assert
                Assert.True(result.IsSuccess);
                Assert.NotNull(result.Data);
                Assert.Equal(deletedCustomerPhoneNumber, result.Data.Phone);

                var customerInDb = await dbContext.Customers.FindAsync(newCustomer.Id);
                Assert.NotNull(customerInDb);
                Assert.Equal(deletedCustomerPhoneNumber, customerInDb.Phone);
            }
        }

        [Fact]
        public async Task UpdateCustomer_PhoneNumberOfDeletedCustomer_Succeeds()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);

                var tonyCustomer = await dbContext.Customers.FindAsync(1);

                if (tonyCustomer != null)
                {
                    tonyCustomer.Deleted = true;
                    await dbContext.SaveChangesAsync();
                }

                var customerId = 3;
                var deletedCustomerPhoneNumber = "23847238";

                var customerUpdates = new Models.Customer
                {
                    Id = customerId,
                    FirstName = "Meadow",
                    LastName = "Soprano",
                    Phone = deletedCustomerPhoneNumber,
                    Email = "msoprano@gmail.com"
                };

                var service = new CustomerService(dbContext);

                // Act
                var result = await service.UpdateCustomer(customerId, customerUpdates);

                // Assert
                Assert.True(result.IsSuccess);
                Assert.NotNull(result.Data);
                Assert.Equal(deletedCustomerPhoneNumber, result.Data.Phone);

                var updatedCustomer = await dbContext.Customers.FindAsync(customerId);
                Assert.Equal(deletedCustomerPhoneNumber, updatedCustomer?.Phone);
            }
        }

        [Fact]
        public async Task UpdateCustomer_DuplicatePhoneNumber_Fails()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);

                var customerId = 3;
                var existingPhoneNumber = "23847238";

                var customerUpdates = new Models.Customer
                {
                    Id = customerId,
                    FirstName = "Meadow",
                    LastName = "Soprano",
                    Phone = existingPhoneNumber,
                    Email = "msoprano@gmail.com"
                };

                var service = new CustomerService(dbContext);

                // Act
                var result = await service.UpdateCustomer(customerId, customerUpdates);

                // Assert
                Assert.False(result.IsSuccess);
                Assert.Equal(400, result.ErrorCode);
                Assert.Equal("Customer with this phone number already exists", result.ErrorMessage);

                var customerInDb = await dbContext.Customers.FindAsync(customerId);
                Assert.NotEqual(existingPhoneNumber, customerInDb?.Phone);
            }
        }

        [Fact]
        public async Task UpdateCustomer_SamePhoneNumber_Succeeds()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);

                var customerId = 3;
                var customer = await dbContext.Customers.FindAsync(customerId);
                var originalPhone = customer?.Phone;
                var newLastName = "Soprano-Smith";

                var customerUpdates = new Models.Customer
                {
                    Id = customerId,
                    FirstName = "Meadow",
                    LastName = newLastName,
                    Phone = originalPhone,
                    Email = "msoprano@gmail.com"
                };

                var service = new CustomerService(dbContext);

                // Act
                var result = await service.UpdateCustomer(customerId, customerUpdates);

                // Assert
                Assert.True(result.IsSuccess);
                Assert.NotNull(result.Data);
                Assert.Equal(newLastName, result.Data.LastName);
                Assert.Equal(originalPhone, result.Data.Phone);
            }
        }

        [Fact]
        public async Task UpdateCustomer_NewUniquePhoneNumber_Succeeds()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);

                var customerId = 3;
                var newPhoneNumber = "11112222";

                var customerUpdates = new Models.Customer
                {
                    Id = customerId,
                    FirstName = "Meadow",
                    LastName = "Soprano",
                    Phone = newPhoneNumber,
                    Email = "msoprano@gmail.com"
                };

                var service = new CustomerService(dbContext);

                // Act
                var result = await service.UpdateCustomer(customerId, customerUpdates);

                // Assert
                Assert.True(result.IsSuccess);
                Assert.NotNull(result.Data);
                Assert.Equal(newPhoneNumber, result.Data.Phone);

                var updatedCustomer = await dbContext.Customers.FindAsync(customerId);
                Assert.Equal(newPhoneNumber, updatedCustomer?.Phone);
            }
        }
    }
}