using ServiceStack;
using ServiceStack.DataAnnotations;

namespace MembershipManager.ServiceModel;

#region Base definition

[Icon(Svg = Icons.School)]
[UniqueConstraint(nameof(UnitId), nameof(SchoolId))]
public class UnitSchool : AuditBase
{
    [AutoIncrement]
    public int Id { get; set; }

    [Ref(Model = nameof(Unit), RefId = nameof(Unit.Id), RefLabel = nameof(Unit.Number))]
    [References(typeof(Unit))]
    public int UnitId { get; set; }

    [Reference]
    public Unit Unit { get; set; } = default!;

    [Ref(Model = nameof(School), RefId = nameof(School.Id), RefLabel = nameof(School.Description))]
    [References(typeof(School))]
    public int SchoolId { get; set; }

    [Reference]
    public School School { get; set; } = default!;
}

#endregion

#region Interactions

[Tag("Units"), Description("Find School & Unit links")]
[ValidateHasRole(Roles.Committee)]
[AutoApply(Behavior.AuditQuery)]
public class QueryUnitSchool : QueryDb<UnitSchool> { }

[Tag("Units"), Description("Link a School to a Unit")]
[ValidateHasRole(Roles.Committee)]
[AutoApply(Behavior.AuditCreate)]
public class CreateUnitSchool : ICreateDb<UnitSchool>, IReturn<IdResponse>
{
    public int UnitId { get; set; }
    public int SchoolId { get; set; }
}

[Tag("Units"), Description("Delete a link of a School to a Unit")]
[ValidateHasRole(Roles.MembershipChair)]
[AutoApply(Behavior.AuditSoftDelete)]
public class DeleteUnitSchool : IDeleteDb<UnitSchool>, IReturnVoid
{
    public int Id { get; set; }
}

#endregion