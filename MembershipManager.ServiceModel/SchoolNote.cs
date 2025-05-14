using ServiceStack;
using ServiceStack.DataAnnotations;

namespace MembershipManager.ServiceModel;

#region Base definition

[UniqueConstraint(nameof(NoteId), nameof(SchoolId))]
public class SchoolNote : AuditBase
{
    [AutoIncrement]
    public int Id { get; set; }

    [ForeignKey(typeof(Note))]
    public int NoteId { get; set; }

    [ForeignKey(typeof(School))]
    public int SchoolId { get; set; }
}

#endregion

#region Interactions

[ValidateHasRole(Roles.Committee)]
[Tag("Schools"), Description("Find Note & School Links")]
[AutoApply(Behavior.AuditQuery)]
public class QuerySchoolNote : QueryDb<SchoolNote> { }

[ValidateHasRole(Roles.Committee)]
[Tag("Schools"), Description("Link a Note to a School")]
[AutoApply(Behavior.AuditCreate)]
public class CreateSchoolNote : ICreateDb<SchoolNote>, IReturn<IdResponse>
{
    public int NoteId { get; set; }
    public int SchoolId { get; set; }
}

[ValidateHasRole(Roles.CouncilExecutive)]
[Tag("Schools"), Description("Delete a link of a Note to a School")]
[AutoApply(Behavior.AuditSoftDelete)]
public class DeleteSchoolNote : IDeleteDb<SchoolNote>, IReturnVoid
{
    public int Id { get; set; }
}

#endregion