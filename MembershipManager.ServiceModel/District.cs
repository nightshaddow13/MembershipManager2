using ServiceStack;
using ServiceStack.DataAnnotations;

namespace MembershipManager.ServiceModel;

#region Base definition

[Icon(Svg = Icons.Earth)]
public class District : AuditBase
{
    [AutoIncrement]
    public int Id { get; set; }

    public string Description { get; set; } = string.Empty;

    [Ref(Model = nameof(Council), RefId = nameof(Council.Id), RefLabel = nameof(Council.Description))]
    [References(typeof(Council))]
    public int CouncilId { get; set; }

    [Reference]
    public List<Unit> Units { get; set; } = [];
}

#endregion

#region Interactions

[Tag("Units"), Description("Find Districts")]
[ValidateHasRole(Roles.Committee)]
[AutoApply(Behavior.AuditQuery)]
public class QueryDistrict : QueryDb<District> { }

[Tag("Units"), Description("Create a new District")]
[ValidateHasRole(Roles.Admin)]
[AutoApply(Behavior.AuditCreate)]
public class CreateDistrict : ICreateDb<District>, IReturn<IdResponse>
{
    [ValidateMaximumLength(25)]
    public string Description { get; set; } = string.Empty;

    public int CouncilId { get; set; }
}

[Tag("Units"), Description("Update a District")]
[ValidateHasRole(Roles.Admin)]
[AutoApply(Behavior.AuditModify)]
public class UpdateDistrict : IPatchDb<District>, IReturn<IdResponse>
{
    public int Id { get; set; }

    [ValidateMaximumLength(25)]
    public string Description { get; set; } = string.Empty;

    public int CouncilId { get; set; }
}

[Tag("Units"), Description("Delete a District")]
[ValidateHasRole(Roles.Admin)]
[AutoApply(Behavior.AuditSoftDelete)]
public class DeleteDistrict : IDeleteDb<District>, IReturnVoid
{
    public int Id { get; set; }
}

#endregion
