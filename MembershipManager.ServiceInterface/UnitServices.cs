using MembershipManager.ServiceModel;
using ServiceStack;
using ServiceStack.OrmLite;

namespace MembershipManager.ServiceInterface;

public class UnitServices(IAutoQueryData autoQuery) : Service
{
    // continue digging here
    // https://docs.servicestack.net/autoquery/service#custom-autoquery-data-implementation
    // need to figure out how to write a custom search query.  I got it working but it doesnt retur the expected response type
    public async Task<List<Unit>> GetAsync(SearchUnits query)
    {
        var q = Db.From<Unit>();
        
        // https://stackoverflow.com/questions/72913628/servicestack-customizable-adhoc-queries-with-multiple-fields
        if (!string.IsNullOrWhiteSpace(query.SearchTerm))
        {
            var searchTerm = query.SearchTerm.ToLower();
            q.Where(x => x.Type.ToString().Contains(searchTerm) || x.Number.ToString().Contains(searchTerm));
        }

        var results =  await Db.LoadSelectAsync(q);

        return results;
    }
}