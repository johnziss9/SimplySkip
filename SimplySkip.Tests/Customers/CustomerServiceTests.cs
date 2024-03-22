namespace SimplySkip.Tests.Customers
{
    public class CustomerServiceTests
    {
        private async Task SeedTestData(SSDbContext dbContext)
        {
            dbContext.Customers.AddRange(new List<Models.Customer>
                {
                    new Models.Customer { Id = 1, FirstName = "Tony", LastName = "Soprano", Address = "New Jersey", Phone = "23847238", Email = "tsoprano@gmail.com" },
                    new Models.Customer { Id = 2, FirstName = "Carmella", LastName = "Soprano", Address = "New Jersey", Phone = "348756348", Email = "csoprano@gmail.com" },
                    new Models.Customer { Id = 3, FirstName = "Meadow", LastName = "Soprano", Address = "New Jersey", Phone = "64645646", Email = "msoprano@gmail.com" }
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
                var newCustomer = new Models.Customer { Id = 4, FirstName = "AJ", LastName = "Soprano", Address = "New Jersey", Phone = "5345345", Email = "ajsoprano@gmail.com" };

                var service = new CustomerService(dbContext);

                // Act
                var result = await service.CreateCustomer(newCustomer);

                // Assert
                Assert.True(result.IsSuccess);
                Assert.NotNull(result.Data);
                Assert.Equal(newCustomer.Id, result.Data.Id);
                Assert.Equal(newCustomer.FirstName, result.Data.FirstName);
                Assert.Equal(newCustomer.LastName, result.Data.LastName);
                Assert.Equal(newCustomer.Address, result.Data.Address);
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
                Assert.Equal(expectedCustomer?.Address, result.Data.Address);
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
                var customerUpdates = new Models.Customer { Id = 3, FirstName = "Meadow", LastName = "Soprano", Address = "New York", Phone = "64645646", Email = "msoprano@gmail.com" };

                var result = await service.UpdateCustomer(updatedCustomerId, customerUpdates);

                // Assert
                Assert.NotNull(result.Data);
                
                var updatedCustomer = dbContext.Customers.Find(updatedCustomerId);
                if (updatedCustomer != null)
                {
                    Assert.Equal(updatedCustomer.Id, result.Data.Id);
                    Assert.Equal(updatedCustomer.FirstName, result.Data.FirstName);
                    Assert.Equal(updatedCustomer.LastName, result.Data.LastName);
                    Assert.Equal(updatedCustomer.Address, result.Data.Address);
                    Assert.Equal(updatedCustomer.Email, result.Data.Email);
                    Assert.Equal(updatedCustomer.Phone, result.Data.Phone);
                }
            }
        }
    }
}