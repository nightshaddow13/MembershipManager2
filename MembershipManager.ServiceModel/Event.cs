using ServiceStack;
using ServiceStack.DataAnnotations;

namespace MembershipManager.ServiceModel;

#region Base definition

[Icon(Svg = Icons.Event)]
public class Event : AuditBase
{
    [AutoIncrement]
    public int Id { get; set; }

    public EventType EventType { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime DateTime { get; set; }

    [ForeignKey(typeof(Location))]
    public int LocationId { get; set; }

    public bool IsConfirmed { get; set; }
    public bool AreFlyersOrdered { get; set; }
    public bool RequiresFacilitron { get; set; }
    public bool IsFacilitronConfirmed { get; set; }

    [Reference]
    public List<EventSchool> SchoolsLink { get; set; } = [];

    [Reference]
    public List<EventUnit> UnitsLink { get; set; } = [];

    [Reference]
    public List<EventNote> NotesLink { get; set; } = [];
}

public enum EventType
{
    SchoolTalk,
    OpenHouse,
    JoinScoutingNight,
    Community
}

#endregion

#region Interactions

[ValidateHasRole(Roles.Admin)]
[ValidateHasRole(Roles.MembershipChair)]
[ValidateHasRole(Roles.CouncilExecutive)]
[ValidateHasRole(Roles.Committee)]
[AutoApply(Behavior.AuditQuery)]
public class QueryEvent : QueryDb<Event> { }

[ValidateHasRole(Roles.Admin)]
[ValidateHasRole(Roles.MembershipChair)]
[ValidateHasRole(Roles.CouncilExecutive)]
[ValidateHasRole(Roles.Committee)]
[AutoApply(Behavior.AuditCreate)]
public class CreateEvent : ICreateDb<Event>, IReturn<IdResponse>
{
    [ApiAllowableValues(typeof(EventType))]
    public EventType EventType { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime DateTime { get; set; }
    public int LocationId { get; set; }

    public bool IsConfirmed { get; set; }
    public bool AreFlyersOrdered { get; set; }
    public bool RequiresFacilitron { get; set; }
    public bool IsFacilitronConfirmed { get; set; }
}

[ValidateHasRole(Roles.Committee)]
[ValidateHasRole(Roles.MembershipChair)]
[ValidateHasRole(Roles.CouncilExecutive)]
[ValidateHasRole(Roles.Committee)]
[AutoApply(Behavior.AuditModify)]
public class UpdateEvent : IPatchDb<Event>, IReturn<IdResponse>
{
    [ApiAllowableValues(typeof(EventType))]
    public EventType EventType { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime DateTime { get; set; }
    public int LocationId { get; set; }

    public bool IsConfirmed { get; set; }
    public bool AreFlyersOrdered { get; set; }
    public bool RequiresFacilitron { get; set; }
    public bool IsFacilitronConfirmed { get; set; }
}

[ValidateHasRole(Roles.Admin)]
[ValidateHasRole(Roles.MembershipChair)]
[ValidateHasRole(Roles.CouncilExecutive)]
[AutoApply(Behavior.AuditSoftDelete)]
public class DeleteEvent : IDeleteDb<Event>, IReturnVoid
{
    public int Id { get; set; }
}

#endregion