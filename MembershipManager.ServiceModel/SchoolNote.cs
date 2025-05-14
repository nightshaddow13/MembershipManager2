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

[ValidateHasRole(Roles.Admin)]
[ValidateHasRole(Roles.MembershipChair)]
[ValidateHasRole(Roles.CouncilExecutive)]
[ValidateHasRole(Roles.Committee)]
[AutoApply(Behavior.AuditQuery)]
public class QuerySchoolNote : QueryDb<SchoolNote> { }

[ValidateHasRole(Roles.Admin)]
[ValidateHasRole(Roles.MembershipChair)]
[ValidateHasRole(Roles.CouncilExecutive)]
[ValidateHasRole(Roles.Committee)]
[AutoApply(Behavior.AuditCreate)]
public class CreateSchoolNote : ICreateDb<SchoolNote>, IReturn<IdResponse>
{
    public int NoteId { get; set; }
    public int SchoolId { get; set; }
}

[ValidateHasRole(Roles.Committee)]
[ValidateHasRole(Roles.MembershipChair)]
[ValidateHasRole(Roles.CouncilExecutive)]
[ValidateHasRole(Roles.Committee)]
[AutoApply(Behavior.AuditModify)]
public class UpdateSchoolNote : IPatchDb<SchoolNote>, IReturn<IdResponse>
{
    public int NoteId { get; set; }
    public int SchoolId { get; set; }
}

[ValidateHasRole(Roles.Admin)]
[ValidateHasRole(Roles.MembershipChair)]
[ValidateHasRole(Roles.CouncilExecutive)]
[AutoApply(Behavior.AuditSoftDelete)]
public class DeleteSchoolNote : IDeleteDb<SchoolNote>, IReturnVoid
{
    public int Id { get; set; }
}

#endregion