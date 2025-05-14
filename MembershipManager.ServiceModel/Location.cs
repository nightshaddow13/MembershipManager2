using ServiceStack;
using ServiceStack.DataAnnotations;

namespace MembershipManager.ServiceModel;

#region Base definition

public class Location : AuditBase
{
    [AutoIncrement]
    public int Id { get; set; }

    public string Description { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;

    [ForeignKey(typeof(ZipCode))]
    public int ZipCode { get; set; }

    [Reference]
    public List<School> Schools { get; set; } = [];
}

#endregion

#region Interactions

[ValidateHasRole(Roles.Admin)]
[ValidateHasRole(Roles.MembershipChair)]
[ValidateHasRole(Roles.CouncilExecutive)]
[ValidateHasRole(Roles.Committee)]
[AutoApply(Behavior.AuditQuery)]
public class QueryLocation : QueryDb<Location> { }

[ValidateHasRole(Roles.Admin)]
[ValidateHasRole(Roles.MembershipChair)]
[ValidateHasRole(Roles.CouncilExecutive)]
[ValidateHasRole(Roles.Committee)]
[AutoApply(Behavior.AuditCreate)]
public class CreateLocation : ICreateDb<Location>, IReturn<IdResponse>
{
    public string Description { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public int ZipCode { get; set; }
}

[ValidateHasRole(Roles.Committee)]
[ValidateHasRole(Roles.MembershipChair)]
[ValidateHasRole(Roles.CouncilExecutive)]
[ValidateHasRole(Roles.Committee)]
[AutoApply(Behavior.AuditModify)]
public class UpdateLocation : IPatchDb<Location>, IReturn<IdResponse>
{
    public string Description { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public int ZipCode { get; set; }
}

[ValidateHasRole(Roles.Admin)]
[ValidateHasRole(Roles.MembershipChair)]
[ValidateHasRole(Roles.CouncilExecutive)]
[AutoApply(Behavior.AuditSoftDelete)]
public class DeleteLocation : IDeleteDb<Location>, IReturnVoid
{
    public int Id { get; set; }
}

#endregion