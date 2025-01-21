
namespace SimplySkip.Helpers
{
    public class BookingPaginatedList<T>
    {
        public List<T> Items { get; set; }
        public int TotalCount { get; set; }
        public int PageSize { get; set; }
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public bool HasNext { get; set; }
        public bool HasPrevious { get; set; }
        public BookingCounts Counts { get; set; }

        public BookingPaginatedList(List<T> items, int totalCount, int pageSize, int currentPage, BookingCounts counts)
        {
            Items = items;
            TotalCount = totalCount;
            PageSize = pageSize;
            CurrentPage = currentPage;
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
            HasNext = currentPage < TotalPages;
            HasPrevious = currentPage > 1;
            Counts = counts;
        }
    }
}