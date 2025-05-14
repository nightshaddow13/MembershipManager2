using ServiceStack;
using ServiceStack.DataAnnotations;

namespace MembershipManager.ServiceModel;

#region Base definition

[Icon(Svg = Icons.Earth)]
public class Council : AuditBase
{
    [AutoIncrement]
    public int Id { get; set; }

    public string Description { get; set; } = string.Empty;

    [Reference]
    public List<District> Districts { get; set; } = [];
}

#endregion

#region Interactions

[Tag("Units"), Description("Find Councils")]
[ValidateHasRole(Roles.Committee)]
[AutoApply(Behavior.AuditQuery)]
public class QueryCouncil : QueryDb<Council> { }

[Tag("Units"), Description("Create a new Council")]
[ValidateHasRole(Roles.Admin)]
[AutoApply(Behavior.AuditCreate)]
public class CreateCouncil : ICreateDb<Council>, IReturn<IdResponse>
{
    [ValidateMaximumLength(25)]
    public string Description { get; set; } = string.Empty;
}

[Tag("Units"), Description("Update a Council")]
[ValidateHasRole(Roles.Admin)]
[AutoApply(Behavior.AuditModify)]
public class UpdateCouncil : IPatchDb<Council>, IReturn<IdResponse>
{
    public int Id { get; set; }

    [ValidateMaximumLength(25)]
    public string Description { get; set; } = string.Empty;
}

[Tag("Units"), Description("Delete a Council")]
[ValidateHasRole(Roles.Admin)]
[AutoApply(Behavior.AuditSoftDelete)]
public class DeleteCouncil : IDeleteDb<Council>, IReturnVoid
{
    public int Id { get; set; }
}

#endregion
