using ServiceStack;
using ServiceStack.DataAnnotations;

namespace MembershipManager.ServiceModel;

#region Base definition

[UniqueConstraint(nameof(NoteId), nameof(UnitId))]
public class UnitNote : AuditBase
{
    [AutoIncrement]
    public int Id { get; set; }

    [ForeignKey(typeof(Note))]
    public int NoteId { get; set; }

    [ForeignKey(typeof(Unit))]
    public int UnitId { get; set; }
}

#endregion

#region Interactions

[ValidateHasRole(Roles.Admin)]
[ValidateHasRole(Roles.MembershipChair)]
[ValidateHasRole(Roles.CouncilExecutive)]
[ValidateHasRole(Roles.Committee)]
[AutoApply(Behavior.AuditQuery)]
public class QueryUnitNote : QueryDb<UnitNote> { }

[ValidateHasRole(Roles.Admin)]
[ValidateHasRole(Roles.MembershipChair)]
[ValidateHasRole(Roles.CouncilExecutive)]
[ValidateHasRole(Roles.Committee)]
[AutoApply(Behavior.AuditCreate)]
public class CreateUnitNote : ICreateDb<UnitNote>, IReturn<IdResponse>
{
    public int NoteId { get; set; }
    public int UnitId { get; set; }
}

[ValidateHasRole(Roles.Committee)]
[ValidateHasRole(Roles.MembershipChair)]
[ValidateHasRole(Roles.CouncilExecutive)]
[ValidateHasRole(Roles.Committee)]
[AutoApply(Behavior.AuditModify)]
public class UpdateUnitNote : IPatchDb<UnitNote>, IReturn<IdResponse>
{
    public int NoteId { get; set; }
    public int UnitId { get; set; }
}

[ValidateHasRole(Roles.Admin)]
[ValidateHasRole(Roles.MembershipChair)]
[ValidateHasRole(Roles.CouncilExecutive)]
[AutoApply(Behavior.AuditSoftDelete)]
public class DeleteUnitNote : IDeleteDb<UnitNote>, IReturnVoid
{
    public int Id { get; set; }
}

#endregion