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

[ValidateHasRole(Roles.Committee)]
[Tag("Events"), Description("Find Event & School Links")]
[AutoApply(Behavior.AuditQuery)]
public class QueryEventSchool : QueryDb<EventSchool> { }

[ValidateHasRole(Roles.Committee)]
[Tag("Events"), Description("Link a School to an Event")]
[AutoApply(Behavior.AuditCreate)]
public class CreateEventSchool : ICreateDb<EventSchool>, IReturn<IdResponse>
{
    public int EventId { get; set; }
    public int SchoolId { get; set; }
}

[ValidateHasRole(Roles.CouncilExecutive)]
[Tag("Units"), Description("Delete a link of a School to an Event")]
[AutoApply(Behavior.AuditSoftDelete)]
public class DeleteEventSchool : IDeleteDb<EventSchool>, IReturnVoid
{
    public int Id { get; set; }
}

#endregion