using ServiceStack;
using ServiceStack.DataAnnotations;

namespace MembershipManager.ServiceModel;

#region Base definition

[Icon(Svg = Icons.School)]
[UniqueConstraint(nameof(EventId), nameof(SchoolId))]
public class EventSchool : AuditBase
{
    [AutoIncrement]
    public int Id { get; set; }

    [ForeignKey(typeof(Event))]
    public int EventId { get; set; }

    [ForeignKey(typeof(School))]
    public int SchoolId { get; set; }
}

#endregion

#region Interactions

[ValidateHasRole(Roles.Admin)]
[ValidateHasRole(Roles.MembershipChair)]
[ValidateHasRole(Roles.CouncilExecutive)]
[ValidateHasRole(Roles.Committee)]
[AutoApply(Behavior.AuditQuery)]
public class QueryEventSchool : QueryDb<EventSchool> { }

[ValidateHasRole(Roles.Admin)]
[ValidateHasRole(Roles.MembershipChair)]
[ValidateHasRole(Roles.CouncilExecutive)]
[ValidateHasRole(Roles.Committee)]
[AutoApply(Behavior.AuditCreate)]
public class CreateEventSchool : ICreateDb<EventSchool>, IReturn<IdResponse>
{
    public int EventId { get; set; }
    public int SchoolId { get; set; }
}

[ValidateHasRole(Roles.Committee)]
[ValidateHasRole(Roles.MembershipChair)]
[ValidateHasRole(Roles.CouncilExecutive)]
[ValidateHasRole(Roles.Committee)]
[AutoApply(Behavior.AuditModify)]
public class UpdateEventSchool : IPatchDb<EventSchool>, IReturn<IdResponse>
{
    public int EventId { get; set; }
    public int SchoolId { get; set; }
}

[ValidateHasRole(Roles.Admin)]
[ValidateHasRole(Roles.MembershipChair)]
[ValidateHasRole(Roles.CouncilExecutive)]
[AutoApply(Behavior.AuditSoftDelete)]
public class DeleteEventSchool : IDeleteDb<EventSchool>, IReturnVoid
{
    public int Id { get; set; }
}

#endregion