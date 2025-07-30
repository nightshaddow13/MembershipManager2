using MembershipManager.ServiceModel.Enum;
using MembershipManager.ServiceModel.Interfaces;
using ServiceStack;
using ServiceStack.DataAnnotations;
using System.Security.Cryptography.X509Certificates;

namespace MembershipManager.ServiceModel;

#region Base definition

[Icon(Svg = Icons.School)]
public class School : AuditBase
{
    [AutoIncrement]
    public int Id { get; set; }

    public string Description { get; set; } = string.Empty;
    
    public SchoolType SchoolType { get; set; }
    public GradeLevels GradeLevels { get; set; }

    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public State State { get; set; }
    public string ZipCode { get; set; } = string.Empty;

    [Reference]
    public List<EventSchool> EventsLink { get; set; } = [];

    [Reference]
    public List<UnitSchool> UnitsLink { get; set; } = [];

    [Reference]
    public List<SchoolNote> NotesLink { get; set; } = [];
}

public enum GradeLevels
{
    gKG_5,
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

    [ApiAllowableValues(typeof(SchoolType))]
    public SchoolType SchoolType { get; set; }

    [ApiAllowableValues(typeof(GradeLevels))]
    public GradeLevels GradeLevels { get; set; }

    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;

    [ApiAllowableValues(typeof(State))]
    public State State { get; set; }
    public string ZipCode { get; set; } = string.Empty;
}

[ValidateHasRole(Roles.Committee)]
[Tag("Schools"), Description("Update a School")]
[AutoApply(Behavior.AuditModify)]
public class UpdateSchool : IPatchDb<School>, IReturn<IdResponse>
{
    public int Id { get; set; }
    public string Description { get; set; } = string.Empty;

    [ApiAllowableValues(typeof(GradeLevels))]
    public GradeLevels GradeLevels { get; set; }

    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
}

[ValidateHasRole(Roles.MembershipChair)]
[Tag("Schools"), Description("Delete a School")]
[AutoApply(Behavior.AuditSoftDelete)]
public class DeleteSchool : IDeleteDb<School>, IReturnVoid
{
    public int Id { get; set; }
}

#endregion

#region ServiceModels

[Tag("Schools"), Description("Search Schools")]
[Route("/schools/search", "GET")]
[ValidateHasRole(Roles.NewMemberCoordinator)]
public class SearchSchools : IGet, IReturn<List<School>>, ISearch
{
    public string? SearchTerm { get; set; }
}

#endregion