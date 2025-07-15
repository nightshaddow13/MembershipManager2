using MembershipManager.ServiceModel;
using ServiceStack;
using ServiceStack.OrmLite;

namespace MembershipManager.ServiceInterface;

public class UnitServices(IAutoQueryData autoQuery) : Service
{
    // continue digging here
    // https://docs.servicestack.net/autoquery/service#custom-autoquery-data-implementation
    // need to figure out how to write a custom search query.  I got it working but it doesnt retur the expected response type
    public async Task<QueryResponse<Unit>> GetAsync(QueryUnits query)
    {
        var q = Db.From<Unit>();
        
        if (query.Id != null && query.Id > 0)
            q.Where(x => x.Id == query.Id);

        // https://stackoverflow.com/questions/72913628/servicestack-customizable-adhoc-queries-with-multiple-fields
        if (!string.IsNullOrWhiteSpace(query.SearchTerm))
        {
            var searchTerm = query.SearchTerm.ToLower();
            q.Where(x => x.Type.ToString().Contains(searchTerm) || x.Number.ToString().Contains(searchTerm));
        }

        var total = await Db.CountAsync(q);
        q = q.Limit(query.Skip ?? 0, query.Take ?? 50);

        var results =  await Db.LoadSelectAsync(q);
        var response = new QueryResponse<Unit>()
        {
            Results = results,
            Total = (int)total
        };

        return response;
        //return await Db.SelectAsync<Unit>(q => $"{q.Type} {q.Number}".Contains(query.searchTerm ?? string.Empty));
    }
}