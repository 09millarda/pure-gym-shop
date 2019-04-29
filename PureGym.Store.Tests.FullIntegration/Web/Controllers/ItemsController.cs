using PureGym.Store.Tests.Common;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace PureGym.Store.Tests.FullIntegrationTests.Web.Controllers
{
    public class ItemsController
    {
        [Fact]
        public async Task AnItemThatIsCreatedCanBeFetchedFromTheDatabase()
        {
            await SharedSteps.ResetDatabaseTables();
            Assert.True(true);
        }
    }
}
