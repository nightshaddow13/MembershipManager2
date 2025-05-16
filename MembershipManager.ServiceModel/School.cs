using ServiceStack;
using ServiceStack.DataAnnotations;

namespace MembershipManager.ServiceModel;

#region Base definition

[Icon(Svg = Icons.School)]
public class School : AuditBase
{
    [AutoIncrement]
    public int Id { get; set; }

    public string Description { get; set; } = string.Empty;

    [ForeignKey(typeof(Location))]
    public int LocationId { get; set; }

    public SchoolType SchoolType { get; set; }
    public GradeLevels GradeLevels { get; set; }

    [Reference]
    public List<EventSchool> EventsLink { get; set; } = [];

    [Reference]
    public List<UnitSchool> UnitsLink { get; set; } = [];

    [Reference]
    public List<SchoolNote> NotesLink { get; set; } = [];
}

public enum GradeLevels
{
    gKG_5 = 1,
    gKG_8,
    gKG_12,
    gPK_5,
    gPK_8,
    gPK_12,
    g6_8,
    g6_12,
    g9_12
}

public enum SchoolType
{
    Public,
    Private
}

#endregion

#region Interactions

[ValidateHasRole(Roles.NewMemberCoordinator)]
[Tag("Schools"), Description("Find Schools")]
[AutoApply(Behavior.AuditQuery)]
public class QuerySchool : QueryDb<School> { }

[ValidateHasRole(Roles.Committee)]
[Tag("Schools"), Description("Create a new School")]
[AutoApply(Behavior.AuditCreate)]
public class CreateSchool : ICreateDb<School>, IReturn<IdResponse>
{
    public string Description { get; set; } = string.Empty;
    public int LocationId { get; set; }

    [ApiAllowableValues(typeof(SchoolType))]
    public SchoolType SchoolType { get; set; }

    [ApiAllowableValues(typeof(GradeLevels))]
    public GradeLevels GradeLevels { get; set; }
}

[ValidateHasRole(Roles.Committee)]
[Tag("Schools"), Description("Update a School")]
[AutoApply(Behavior.AuditModify)]
public class UpdateSchool : IPatchDb<School>, IReturn<IdResponse>
{
    public string Description { get; set; } = string.Empty;
    public int LocationId { get; set; }

    [ApiAllowableValues(typeof(GradeLevels))]
    public GradeLevels GradeLevels { get; set; }
}

[ValidateHasRole(Roles.MembershipChair)]
[Tag("Schools"), Description("Delete a School")]
[AutoApply(Behavior.AuditSoftDelete)]
public class DeleteSchool : IDeleteDb<School>, IReturnVoid
{
    public int Id { get; set; }
}

#endregion