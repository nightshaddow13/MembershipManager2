using ServiceStack;
using ServiceStack.DataAnnotations;

namespace MembershipManager.ServiceModel;

#region Base definition

[Icon(Svg = Icons.Note)]
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

[Tag("Units"), Description("Find Note & Unit Links")]
[ValidateHasRole(Roles.NewMemberCoordinator)]
[AutoApply(Behavior.AuditQuery)]
public class QueryUnitNote : QueryDb<UnitNote> { }

[Tag("Units"), Description("Link a Note to a Unit")]
[ValidateHasRole(Roles.Committee)]
[AutoApply(Behavior.AuditCreate)]
public class CreateUnitNote : ICreateDb<UnitNote>, IReturn<IdResponse>
{
    public int NoteId { get; set; }
    public int UnitId { get; set; }
}

[Tag("Units"), Description("Delete a link of a Note to a Unit")]
[ValidateHasRole(Roles.MembershipChair)]
[AutoApply(Behavior.AuditSoftDelete)]
public class DeleteUnitNote : IDeleteDb<UnitNote>, IReturnVoid
{
    public int Id { get; set; }
}

#endregion