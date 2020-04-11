using System;
using System.Globalization;
using System.Linq;
using MyNutritionComrade.Extensions;
using MyNutritionComrade.Models.Paging;
using Xunit;

namespace MyNutritionComrade.Tests.Extensions
{
    public class PagingExtensionsTests
    {
        private static DateTimeOffset ToDate(string date) => DateTimeOffset.ParseExact(date, "d", CultureInfo.InvariantCulture);

        public class TestItem
        {
            public TestItem(string id, string createdOn)
            {
                Id = id;
                CreatedOn = ToDate(createdOn);
            }

            public string Id { get; set; }
            public DateTimeOffset CreatedOn { get; set; }
        }

        [Fact]
        public void TestPageAscendingWithoutConfig()
        {
            var items = new[]
            {
                new TestItem("1", "04/10/2020"), new TestItem("2", "04/11/2020"), new TestItem("3", "04/12/2020"), new TestItem("4", "04/13/2020"),
                new TestItem("5", "04/14/2020"),
            };

            var request = new PagingRequest();

            var list = items.AsQueryable().PageByDateTime(request, x => x.CreatedOn).ToList();

            Assert.Equal(new[] {"1", "2", "3", "4", "5"}, list.Select(x => x.Id));
        }

        [Fact]
        public void TestPageDescendingWithoutConfig()
        {
            var items = new[]
            {
                new TestItem("1", "04/10/2020"), new TestItem("2", "04/11/2020"), new TestItem("3", "04/12/2020"), new TestItem("4", "04/13/2020"),
                new TestItem("5", "04/14/2020"),
            };

            var request = new PagingRequest{SortDirection = SortDirection.Descending};

            var list = items.AsQueryable().PageByDateTime(request, x => x.CreatedOn).ToList();

            Assert.Equal(new[] {"5", "4", "3", "2", "1"}, list.Select(x => x.Id));
        }

        [Fact]
        public void TestPageAfterAscendingSort()
        {
            var items = new[]
            {
                new TestItem("1", "04/10/2020"), new TestItem("2", "04/11/2020"), new TestItem("3", "04/12/2020"), new TestItem("4", "04/13/2020"),
                new TestItem("5", "04/14/2020"),
            };

            var request = new PagingRequest {PageAfter = ToDate("04/11/2020")};

            var list = items.AsQueryable().PageByDateTime(request, x => x.CreatedOn, SortDirection.Ascending).ToList();

            Assert.Equal(new[] {"3", "4", "5"}, list.Select(x => x.Id));
        }

        [Fact]
        public void TestPageBeforeAscendingSort()
        {
            var items = new[]
            {
                new TestItem("1", "04/10/2020"), new TestItem("2", "04/11/2020"), new TestItem("3", "04/12/2020"), new TestItem("4", "04/13/2020"),
                new TestItem("5", "04/14/2020"),
            };

            var request = new PagingRequest { PageBefore = ToDate("04/12/2020") };

            var list = items.AsQueryable().PageByDateTime(request, x => x.CreatedOn, SortDirection.Ascending).ToList();

            Assert.Equal(new[] {"2", "1"}, list.Select(x => x.Id));
        }

        [Fact]
        public void TestPageAfterDescendingSort()
        {
            var items = new[]
            {
                new TestItem("5", "04/14/2020"),
                new TestItem("4", "04/13/2020"),
                new TestItem("3", "04/12/2020"),
                new TestItem("2", "04/11/2020"),
                new TestItem("1", "04/10/2020"),

            };

            var request = new PagingRequest { PageAfter = ToDate("04/13/2020") };

            var list = items.AsQueryable().PageByDateTime(request, x => x.CreatedOn, SortDirection.Descending).ToList();

            Assert.Equal(new[] { "3", "2", "1" }, list.Select(x => x.Id));
        }

        [Fact]
        public void TestPageBeforeDescendingSort()
        {
            var items = new[]
            {
                new TestItem("5", "04/14/2020"),
                new TestItem("4", "04/13/2020"),
                new TestItem("3", "04/12/2020"),
                new TestItem("2", "04/11/2020"),
                new TestItem("1", "04/10/2020"),

            };

            var request = new PagingRequest { PageBefore = ToDate("04/13/2020") };

            var list = items.AsQueryable().PageByDateTime(request, x => x.CreatedOn, SortDirection.Descending).ToList();

            Assert.Equal(new[] { "5" }, list.Select(x => x.Id));
        }

        [Fact]
        public void TestPageBeforeDescendingSortLimit()
        {
            var items = new[]
            {
                new TestItem("5", "04/14/2020"),
                new TestItem("4", "04/13/2020"),
                new TestItem("3", "04/12/2020"),
                new TestItem("2", "04/11/2020"), // <- cursor
                new TestItem("1", "04/10/2020"),

            };

            var request = new PagingRequest { PageBefore = ToDate("04/11/2020"), PageSize = 2};

            var list = items.AsQueryable().PageByDateTime(request, x => x.CreatedOn, SortDirection.Descending).ToList();

            Assert.Equal(new[] { "3", "4" }, list.Select(x => x.Id));
        }

        [Fact]
        public void TestPageBeforeAscendingSortLimit()
        {
            var items = new[]
            {
                new TestItem("1", "04/10/2020"),
                new TestItem("2", "04/11/2020"),
                new TestItem("3", "04/12/2020"),
                new TestItem("4", "04/13/2020"), // <- cursor
                new TestItem("5", "04/14/2020"),
            };

            var request = new PagingRequest { PageBefore = ToDate("04/13/2020"), PageSize = 2};

            var list = items.AsQueryable().PageByDateTime(request, x => x.CreatedOn).ToList();

            Assert.Equal(new[] { "3", "2" }, list.Select(x => x.Id));
        }

        [Fact]
        public void TestCreateLinksAscending()
        {
            var items = new[]
            {
                new TestItem("1", "04/10/2020"),
                new TestItem("2", "04/11/2020"),
                new TestItem("3", "04/12/2020"),
                new TestItem("4", "04/13/2020"),
                new TestItem("5", "04/14/2020"),
            };

            var links = PagingExtensions.CreateLinks(items, x => x.CreatedOn, SortDirection.Ascending);

            Assert.Equal(ToDate("04/10/2020"), links.Previous?.PageBefore);
            Assert.Null(links.Previous?.PageAfter);

            Assert.Equal(ToDate("04/14/2020"), links.Next?.PageAfter);
            Assert.Null(links.Next?.PageBefore);
        }

        [Fact]
        public void TestCreateLinksDescending()
        {
            var items = new[]
            {
                new TestItem("5", "04/14/2020"),
                new TestItem("4", "04/13/2020"),
                new TestItem("3", "04/12/2020"),
                new TestItem("2", "04/11/2020"),
                new TestItem("1", "04/10/2020"),
            };

            var links = PagingExtensions.CreateLinks(items, x => x.CreatedOn, SortDirection.Descending);

            Assert.Equal(ToDate("04/14/2020"), links.Previous?.PageBefore);
            Assert.Null(links.Previous?.PageAfter);

            Assert.Equal(ToDate("04/10/2020"), links.Next?.PageAfter);
            Assert.Null(links.Next?.PageBefore);
        }
    }
}
