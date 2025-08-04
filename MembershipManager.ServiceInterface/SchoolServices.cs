using MembershipManager.ServiceModel;
using ServiceStack;
using ServiceStack.OrmLite;

namespace MembershipManager.ServiceInterface;

public class SchoolServices(IAutoQueryData autoQuery) : Service
{
    // continue digging here
    // https://docs.servicestack.net/autoquery/service#custom-autoquery-data-implementation
    // need to figure out how to write a custom search query.  I got it working but it doesnt retur the expected response type
    public async Task<List<School>> GetAsync(SearchSchools query)
    {
        var q = Db.From<School>().Where(x => x.DeletedBy == null);
        
        // https://stackoverflow.com/questions/72913628/servicestack-customizable-adhoc-queries-with-multiple-fields
        if (!string.IsNullOrWhiteSpace(query.SearchTerm))
        {
            var searchTerm = query.SearchTerm.ToLower();
            q.Where(x => x.Description.Contains(searchTerm))
                .OrderBy(x => x.EventsLink.Count).ThenBy(x => x.UnitsLink.Count);
        }

        var results =  await Db.LoadSelectAsync(q);

        return results;
    }
}