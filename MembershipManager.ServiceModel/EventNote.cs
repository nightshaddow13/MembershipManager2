using ServiceStack;
using ServiceStack.DataAnnotations;

namespace MembershipManager.ServiceModel;

#region Base definition

[UniqueConstraint(nameof(NoteId), nameof(EventId))]
public class EventNote : AuditBase
{
    [AutoIncrement]
    public int Id { get; set; }

    [ForeignKey(typeof(Note))]
    public int NoteId { get; set; }

    [ForeignKey(typeof(Event))]
    public int EventId { get; set; }
}

#endregion

#region Interactions

[ValidateHasRole(Roles.Committee)]
[Tag("Events"), Description("Find Event Notes")]
[AutoApply(Behavior.AuditQuery)]
public class QueryEventNote : QueryDb<EventNote> { }

[ValidateHasRole(Roles.Committee)]
[Tag("Events"), Description("Create a new Event Note")]
[AutoApply(Behavior.AuditCreate)]
public class CreateEventNote : ICreateDb<EventNote>, IReturn<IdResponse>
{
    public int NoteId { get; set; }
    public int EventId { get; set; }
}

[ValidateHasRole(Roles.Committee)]
[Tag("Events"), Description("Update an Event Note")]
[AutoApply(Behavior.AuditModify)]
public class UpdateEventNote : IPatchDb<EventNote>, IReturn<IdResponse>
{
    public int NoteId { get; set; }
    public int EventId { get; set; }
}

[ValidateHasRole(Roles.CouncilExecutive)]
[Tag("Events"), Description("Delete an Event Note")]
[AutoApply(Behavior.AuditSoftDelete)]
public class DeleteEventNote : IDeleteDb<EventNote>, IReturnVoid
{
    public int Id { get; set; }
}

#endregion