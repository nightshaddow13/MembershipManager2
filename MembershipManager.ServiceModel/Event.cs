using MembershipManager.ServiceModel.Enum;
using ServiceStack;
using ServiceStack.DataAnnotations;

namespace MembershipManager.ServiceModel;

#region Base definition

[Icon(Svg = Icons.Event)]
public class Event : AuditBase
{
    [AutoIncrement]
    public int Id { get; set; }

    // Event information
    public EventType EventType { get; set; }

    public string Description { get; set; } = string.Empty;
    public DateTime DateTime { get; set; }

    // Address
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public State State { get; set; }
    public string ZipCode { get; set; } = string.Empty;

    // Checklist
    public bool IsConfirmedBySchool { get; set; }
    public bool IsConfirmedByUnit { get; set; }
    public bool NeedFlyers { get; set; }
    public bool AreFlyersOrdered { get; set; }
    public bool AreFlyersDelivered { get; set; }
    public bool RequiresFacilitron { get; set; }
    public bool IsFacilitronConfirmed { get; set; }

    // References
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

[ValidateHasRole(Roles.NewMemberCoordinator)]
[Tag("Events"), Description("Find Events")]
[Route("/events", "GET")]
[Route("/events/{Id}", "GET")]
[AutoApply(Behavior.AuditQuery)]
public class QueryEvent : QueryDb<Event>
{
    public int? Id { get; set; }
}

[ValidateHasRole(Roles.Committee)]
[Tag("Events"), Description("Create a new Event")]
[AutoApply(Behavior.AuditCreate)]
public class CreateEvent : ICreateDb<Event>, IReturn<IdResponse>
{
    [ApiAllowableValues(typeof(EventType))]
    public EventType EventType { get; set; }

    [ValidateNotEmpty]
    public string Description { get; set; } = string.Empty;
    public DateTime DateTime { get; set; }

    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;

    [ApiAllowableValues(typeof(State))]
    public State State { get; set; }
    public string ZipCode { get; set; } = string.Empty;

    public bool IsConfirmedBySchool { get; set; }
    public bool IsConfirmedByUnit { get; set; }
    public bool NeedFlyers { get; set; }
    public bool AreFlyersOrdered { get; set; }
    public bool AreFlyersDelivered { get; set; }
    public bool RequiresFacilitron { get; set; }
    public bool IsFacilitronConfirmed { get; set; }
}

[ValidateHasRole(Roles.Committee)]
[Tag("Events"), Description("Update an Event")]
[AutoApply(Behavior.AuditModify)]
public class UpdateEvent : IPatchDb<Event>, IReturn<IdResponse>
{
    public int Id { get; set; }

    [ApiAllowableValues(typeof(EventType))]
    public EventType EventType { get; set; }

    [ValidateNotEmpty]
    public string Description { get; set; } = string.Empty;
    public DateTime DateTime { get; set; }

    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;

    public bool? IsConfirmedBySchool { get; set; }
    public bool? IsConfirmedByUnit { get; set; }
    public bool? NeedFlyers { get; set; }
    public bool? AreFlyersOrdered { get; set; }
    public bool? AreFlyersDelivered { get; set; }
    public bool? RequiresFacilitron { get; set; }
    public bool? IsFacilitronConfirmed { get; set; }
}

[ValidateHasRole(Roles.MembershipChair)]
[Tag("Events"), Description("Delete an Event")]
[AutoApply(Behavior.AuditSoftDelete)]
public class DeleteEvent : IDeleteDb<Event>, IReturnVoid
{
    public int Id { get; set; }
}

#endregion