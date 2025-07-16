using ServiceStack;
using ServiceStack.DataAnnotations;

namespace MembershipManager.ServiceModel;

#region Base definition

[Icon(Svg = Icons.Unit)]
public class Unit : AuditBase
{
    [AutoIncrement]
    public int Id { get; set; }

    [Ref(Model = nameof(District), RefId = nameof(District.Id), RefLabel = nameof(District.Description))]
    [References(typeof(District))]
    public int DistrictId { get; set; }

    [Reference]
    public District District { get; set; } = default!;

    public UnitType Type { get; set; }
    public Sex Sex { get; set; }
    public int Number { get; set; }

    [Reference]
    public List<EventUnit> EventsLink { get; set; } = [];

    [Reference]
    public List<UnitSchool> SchoolsLink { get; set; } = [];

    [Reference]
    public List<UnitNote> NotesLink { get; set; } = [];
}

public enum UnitType
{
    Pack,
    Troop,
    Crew,
    Ship
}

public enum Sex
{
    Family,
    Male,
    Female
}

#endregion

#region Interactions

[Tag("Units"), Description("Find Units")]
[Route("/units", "GET")]
[Route("/units/{Id}", "GET")]
[ValidateHasRole(Roles.NewMemberCoordinator)]
[AutoApply(Behavior.AuditQuery)]
public class QueryUnits : QueryDb<Unit>
{
    public int? Id { get; set; }
}

[Tag("Units"), Description("Create a new Unit")]
[ValidateHasRole(Roles.MembershipChair)]
[AutoApply(Behavior.AuditCreate)]
public class CreateUnit : ICreateDb<Unit>, IReturn<IdResponse>
{
    [ApiAllowableValues(typeof(Sex))]
    public Sex Sex { get; set; }

    [ApiAllowableValues(typeof(UnitType))]
    public UnitType Type { get; set; }

    [ValidateGreaterThan(0)]
    public int Number { get; set; }

    public int DistrictId { get; set; }
}

[Tag("Units"), Description("Update an existing Unit")]
[ValidateHasRole(Roles.MembershipChair)]
[AutoApply(Behavior.AuditModify)]
public class UpdateUnit : IPatchDb<Unit>, IReturn<IdResponse>
{
    public int Id { get; set; }

    [ApiAllowableValues(typeof(Sex))]
    public Sex Sex { get; set; }

    [ApiAllowableValues(typeof(UnitType))]
    public UnitType Type { get; set; }

    [ValidateGreaterThan(0)]
    public int Number { get; set; }

    public int DistrictId { get; set; }
}

[Tag("Units"), Description("Delete a Unit")]
[ValidateHasRole(Roles.MembershipChair)]
[AutoApply(Behavior.AuditSoftDelete)]
public class DeleteUnit : IDeleteDb<Unit>, IReturnVoid
{
    public int Id { get; set; }
}

#endregion

#region ServiceModels

[Tag("Units"), Description("Search Units")]
[Route("/units/search", "GET")]
[ValidateHasRole(Roles.NewMemberCoordinator)]
public class SearchUnits : IGet, IReturn<List<Unit>>
{
    public string? SearchTerm { get; set; }
}

#endregion