using ServiceStack;
using ServiceStack.DataAnnotations;

namespace MembershipManager.ServiceModel;

#region Base definition

public class ZipCode : AuditBase
{
    public int Id { get; set; }
    public string City { get; set; } = string.Empty;
    public State State { get; set; } = State.FL;

    [Reference]
    public List<Location> Locations { get; set; } = [];
}

public enum State
{
    FL
}

#endregion

#region Interactions

[ValidateHasRole(Roles.Admin)]
[ValidateHasRole(Roles.MembershipChair)]
[ValidateHasRole(Roles.CouncilExecutive)]
[ValidateHasRole(Roles.Committee)]
[AutoApply(Behavior.AuditQuery)]
public class QueryZipCode : QueryDb<ZipCode> { }

[ValidateHasRole(Roles.Admin)]
[ValidateHasRole(Roles.MembershipChair)]
[ValidateHasRole(Roles.CouncilExecutive)]
[AutoApply(Behavior.AuditCreate)]
public class CreateZipCode : ICreateDb<ZipCode>, IReturn<IdResponse>
{
    public int Id { get; set; }
    public string City { get; set; } = string.Empty;

    [ApiAllowableValues(typeof(State))]
    public State State { get; set; } = State.FL;
}

[ValidateHasRole(Roles.Committee)]
[ValidateHasRole(Roles.MembershipChair)]
[ValidateHasRole(Roles.CouncilExecutive)]
[ValidateHasRole(Roles.Committee)]
[AutoApply(Behavior.AuditModify)]
public class UpdateZipCode : IPatchDb<ZipCode>, IReturn<IdResponse>
{
    public string City { get; set; } = string.Empty;

    [ApiAllowableValues(typeof(State))]
    public State State { get; set; } = State.FL;
}

[ValidateHasRole(Roles.Admin)]
[ValidateHasRole(Roles.MembershipChair)]
[ValidateHasRole(Roles.CouncilExecutive)]
[AutoApply(Behavior.AuditSoftDelete)]
public class DeleteZipCode : IDeleteDb<ZipCode>, IReturnVoid
{
    public int Id { get; set; }
}

#endregion