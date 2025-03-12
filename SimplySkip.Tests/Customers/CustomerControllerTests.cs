using SimplySkip.Helpers;

namespace SimplySkip.Tests.Customers
{
    public class CustomerControllerTests
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

                var controller = new CustomerController(new CustomerService(dbContext));

                // Act
                var actionResult = await controller.GetAll();

                // Assert
                var result = actionResult.Result as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal(StatusCodes.Status200OK, result.StatusCode);

                var returnedCustomers = result.Value as List<Models.Customer>;
                Assert.NotNull(returnedCustomers);
                Assert.Equal(3, returnedCustomers.Count);
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

                var controller = new CustomerController(new CustomerService(dbContext));

                // Act
                var actionResult = await controller.Create(newCustomer);

                // Assert
                var result = actionResult.Result as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal(StatusCodes.Status200OK, result.StatusCode);

                var returnedCustomer = result.Value as Models.Customer;
                Assert.NotNull(returnedCustomer);
                Assert.Equal(newCustomer.Id, returnedCustomer.Id);
                Assert.Equal(newCustomer.FirstName, returnedCustomer.FirstName);
                Assert.Equal(newCustomer.LastName, returnedCustomer.LastName);
                Assert.Equal(newCustomer.Email, returnedCustomer.Email);
                Assert.Equal(newCustomer.Phone, returnedCustomer.Phone);
            }
        }

        [Fact]
        public async Task CreateCustomer_PhoneNumberOfDeletedCustomer_Success()
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

                var deletedCustomerPhoneNumber = "23847238";
                var newCustomer = new Models.Customer
                {
                    Id = 4,
                    FirstName = "Christopher",
                    LastName = "Moltisanti",
                    Phone = deletedCustomerPhoneNumber,
                    Email = "cmoltisanti@gmail.com"
                };

                var controller = new CustomerController(new CustomerService(dbContext));

                // Act
                var actionResult = await controller.Create(newCustomer);

                // Assert
                var result = actionResult.Result as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal(StatusCodes.Status200OK, result.StatusCode);

                var returnedCustomer = result.Value as Models.Customer;
                Assert.NotNull(returnedCustomer);
                Assert.Equal(newCustomer.Phone, returnedCustomer.Phone);
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

                var controller = new CustomerController(new CustomerService(dbContext));

                // Act
                var actionResult = await controller.Get(expectedCustomerId);

                // Assert
                var result = actionResult.Result as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal(StatusCodes.Status200OK, result.StatusCode);

                var returnedCustomer = result.Value as Models.Customer;
                Assert.NotNull(returnedCustomer);
                Assert.Equal(expectedCustomer?.Id, returnedCustomer.Id);
                Assert.Equal(expectedCustomer?.FirstName, returnedCustomer.FirstName);
                Assert.Equal(expectedCustomer?.LastName, returnedCustomer.LastName);
                Assert.Equal(expectedCustomer?.Email, returnedCustomer.Email);
                Assert.Equal(expectedCustomer?.Phone, returnedCustomer.Phone);
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

                var controller = new CustomerController(new CustomerService(dbContext));

                // Act
                var customerUpdates = new Models.Customer { Id = 3, FirstName = "Meadow", LastName = "Soprano", Phone = "64645646", Email = "msoprano@gmail.com" };

                var actionResult = await controller.Update(updatedCustomerId, customerUpdates);

                // Assert
                var result = actionResult.Result as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal(StatusCodes.Status200OK, result.StatusCode);

                var returnedCustomer = result.Value as Models.Customer;
                Assert.NotNull(returnedCustomer);

                var updatedCustomer = dbContext.Customers.Find(updatedCustomerId);
                if (updatedCustomer != null)
                {
                    Assert.Equal(updatedCustomer.Id, returnedCustomer.Id);
                    Assert.Equal(updatedCustomer.FirstName, returnedCustomer.FirstName);
                    Assert.Equal(updatedCustomer.LastName, returnedCustomer.LastName);
                    Assert.Equal(updatedCustomer.Email, returnedCustomer.Email);
                    Assert.Equal(updatedCustomer.Phone, returnedCustomer.Phone);
                }
            }
        }

        [Fact]
        public async Task UpdateCustomer_PhoneNumberOfDeletedCustomer_Success()
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

                var controller = new CustomerController(new CustomerService(dbContext));

                // Act
                var customerUpdates = new Models.Customer
                {
                    Id = customerId,
                    FirstName = "Meadow",
                    LastName = "Soprano",
                    Phone = deletedCustomerPhoneNumber,
                    Email = "msoprano@gmail.com"
                };

                var actionResult = await controller.Update(customerId, customerUpdates);

                // Assert
                var result = actionResult.Result as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal(StatusCodes.Status200OK, result.StatusCode);

                var returnedCustomer = result.Value as Models.Customer;
                Assert.NotNull(returnedCustomer);
                Assert.Equal(deletedCustomerPhoneNumber, returnedCustomer.Phone);
            }
        }

        [Fact]
        public async Task GetPaginated_Success_NoSearch()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);
                var controller = new CustomerController(new CustomerService(dbContext));

                // Act
                var actionResult = await controller.GetPaginated(page: 1);

                // Assert
                var result = actionResult.Result as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal(StatusCodes.Status200OK, result.StatusCode);

                var returnedData = result.Value as PaginatedList<Models.Customer>;
                Assert.NotNull(returnedData);
                Assert.Equal(3, returnedData.TotalCount);
                Assert.Equal(1, returnedData.CurrentPage);
                Assert.Equal(15, returnedData.PageSize);
                Assert.False(returnedData.HasNext);
            }
        }

        [Fact]
        public async Task GetPaginated_Success_WithSearch()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SSDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using (var dbContext = new SSDbContext(options))
            {
                await SeedTestData(dbContext);
                var controller = new CustomerController(new CustomerService(dbContext));

                // Act
                var actionResult = await controller.GetPaginated(page: 1, search: "Tony");

                // Assert
                var result = actionResult.Result as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal(StatusCodes.Status200OK, result.StatusCode);

                var returnedData = result.Value as PaginatedList<Models.Customer>;
                Assert.NotNull(returnedData);
                Assert.Single(returnedData.Items);
                Assert.Equal(1, returnedData.TotalCount);
                Assert.Equal("Tony", returnedData.Items[0].FirstName);
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
                var controller = new CustomerController(new CustomerService(dbContext));

                // Act
                var actionResult = await controller.GetPaginated(page: -1);

                // Assert
                var result = actionResult.Result as OkObjectResult;
                Assert.NotNull(result);
                Assert.Equal(StatusCodes.Status200OK, result.StatusCode);

                var returnedData = result.Value as PaginatedList<Models.Customer>;
                Assert.NotNull(returnedData);
                Assert.Equal(1, returnedData.CurrentPage);
            }
        }
    }
}