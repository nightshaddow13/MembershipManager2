using ServiceStack;
using ServiceStack.DataAnnotations;
using System.ComponentModel.DataAnnotations;

namespace MembershipManager.ServiceModel;

#region Base definition

public class Note : AuditBase
{
    [AutoIncrement]
    public int Id { get; set; }

    public string Description { get; set; } = string.Empty;

    [Reference]
    public List<SchoolNote> SchoolsLink { get; set; } = [];

    [Reference]
    public List<UnitNote> UnitsLink { get; set; } = [];
    
    [Reference]
    public List<EventNote> EventsLinks { get; set; } = [];
}

#endregion

#region Interactions

[ValidateHasRole(Roles.Committee)]
[Tag("Shared"), Description("Find Notes")]
[AutoApply(Behavior.AuditQuery)]
public class QueryNotes : QueryDb<Note> 
{
    public List<int> Ids { get; set; }
}

[ValidateHasRole(Roles.Committee)]
[Tag("Shared"), Description("Create a new Note")]
[AutoApply(Behavior.AuditCreate)]
public class CreateNote : ICreateDb<Note>, IReturn<IdResponse>
{
    public string Description { get; set; } = string.Empty;
}

[ValidateHasRole(Roles.Committee)]
[Tag("Shared"), Description("Update a Note")]
[AutoApply(Behavior.AuditModify)]
public class UpdateNote : IPatchDb<Note>, IReturn<IdResponse>
{
    public int Id { get; set; }

    [ValidateMaximumLength(25)]
    public string Description { get; set; } = string.Empty;
}

[ValidateHasRole(Roles.MembershipChair)]
[Tag("Shared"), Description("Delete a Note")]
[AutoApply(Behavior.AuditSoftDelete)]
public class DeleteNote : IDeleteDb<Note>, IReturnVoid
{
    public int Id { get; set; }
}

#endregion
