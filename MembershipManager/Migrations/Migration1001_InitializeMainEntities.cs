using ServiceStack.DataAnnotations;
using ServiceStack.OrmLite;

namespace MembershipManager.Migrations;

public class Migration1001_InitializeMainEntities : MigrationBase
{
    #region council / district

    class District : AuditBase
    {
        [AutoIncrement]
        public int Id { get; set; }

        public string Description { get; set; } = string.Empty;

        [Ref(Model = nameof(Council), RefId = nameof(Council.Id), RefLabel = nameof(Council.Description))]
        [References(typeof(Council))]
        public int CouncilId { get; set; }

        [Reference]
        public List<Unit> Units { get; set; } = [];
    }

    class Council : AuditBase
    {
        [AutoIncrement]
        public int Id { get; set; }

        public string Description { get; set; } = string.Empty;

        [Reference]
        public List<District> Districts { get; set; } = [];
    }

    #endregion

    #region Unit

    enum UnitType
    {
        Pack,
        Troop,
        Crew,
        Ship
    }

    enum Sex
    {
        Family,
        Male,
        Female
    }

    class Unit : AuditBase
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

    #endregion

    #region Zip Code / Location
    
    enum State
    {
        FL
    }

    class ZipCode : AuditBase
    {
        public int Id { get; set; }
        public string City { get; set; } = string.Empty;
        public State State { get; set; } = State.FL;

        [Reference]
        public List<Location> Locations { get; set; } = [];
    }

    class Location : AuditBase
    {
        [AutoIncrement]
        public int Id { get; set; }

        public string Description { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;

        [ForeignKey(typeof(ZipCode))]
        public int ZipCode { get; set; }

        [Reference]
        public List<School> Schools { get; set; } = [];
    }

    #endregion

    #region School

    enum GradeLevels
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

    enum SchoolType
    {
        Public,
        Private
    }

    class School : AuditBase
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

    #endregion

    #region Events

    enum EventType
    {
        SchoolTalk,
        OpenHouse,
        JoinScoutingNight,
        Community
    }

    class Event : AuditBase
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

    [UniqueConstraint(nameof(EventId), nameof(SchoolId))]
    class EventSchool : AuditBase
    {
        [AutoIncrement]
        public int Id { get; set; }

        [ForeignKey(typeof(Event))]
        public int EventId { get; set; }

        [ForeignKey(typeof(School))]
        public int SchoolId { get; set; }
    }

    [UniqueConstraint(nameof(EventId), nameof(UnitId))]
    class EventUnit : AuditBase
    {
        [AutoIncrement]
        public int Id { get; set; }

        [Ref(Model = nameof(Event), RefId = nameof(Event.Id), RefLabel = nameof(Event.Description))]
        [References(typeof(Event))]
        public int EventId { get; set; }

        [Ref(Model = nameof(Unit), RefId = nameof(Unit.Id), RefLabel = nameof(Unit.Number))]
        [References(typeof(Unit))]
        public int UnitId { get; set; }
    }

    #endregion

    #region UnitSchool

    [UniqueConstraint(nameof(UnitId), nameof(SchoolId))]
    class UnitSchool : AuditBase
    {
        [AutoIncrement]
        public int Id { get; set; }

        [Ref(Model = nameof(Unit), RefId = nameof(Unit.Id), RefLabel = nameof(Unit.Number))]
        [References(typeof(Unit))]
        public int UnitId { get; set; }

        [Reference]
        public Unit Unit { get; set; } = default!;

        [Ref(Model = nameof(School), RefId = nameof(School.Id), RefLabel = nameof(School.Description))]
        [References(typeof(School))]
        public int SchoolId { get; set; }

        [Reference]
        public School School { get; set; } = default!;
    }

    #endregion

    #region Notes

    class Note : AuditBase
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

    [UniqueConstraint(nameof(NoteId), nameof(UnitId))]
    class UnitNote : AuditBase
    {
        [AutoIncrement]
        public int Id { get; set; }

        [ForeignKey(typeof(Note))]
        public int NoteId { get; set; }

        [ForeignKey(typeof(Unit))]
        public int UnitId { get; set; }
    }

    [UniqueConstraint(nameof(NoteId), nameof(SchoolId))]
    class SchoolNote : AuditBase
    {
        [AutoIncrement]
        public int Id { get; set; }

        [ForeignKey(typeof(Note))]
        public int NoteId { get; set; }

        [ForeignKey(typeof(School))]
        public int SchoolId { get; set; }
    }

    [UniqueConstraint(nameof(NoteId), nameof(EventId))]
    class EventNote : AuditBase
    {
        [AutoIncrement]
        public int Id { get; set; }

        [ForeignKey(typeof(Note))]
        public int NoteId { get; set; }

        [ForeignKey(typeof(Event))]
        public int EventId { get; set; }
    }

    #endregion

    public override void Up()
    {
        Db.CreateTable<Council>();
        Db.CreateTable<District>();
        Db.CreateTable<Unit>();
        Db.CreateTable<ZipCode>();
        Db.CreateTable<Location>();
        Db.CreateTable<School>();
        Db.CreateTable<Event>();
        Db.CreateTable<EventSchool>();
        Db.CreateTable<EventUnit>();
        Db.CreateTable<UnitSchool>();
        Db.CreateTable<Note>();
        Db.CreateTable<UnitNote>();
        Db.CreateTable<SchoolNote>();
        Db.CreateTable<EventNote>();
    }

    public override void Down()
    {
        Db.DropTable<UnitNote>();
        Db.DropTable<SchoolNote>();
        Db.DropTable<EventNote>();
        Db.DropTable<Note>();
        Db.DropTable<UnitSchool>();
        Db.DropTable<EventUnit>();
        Db.DropTable<EventSchool>();
        Db.DropTable<Event>();
        Db.DropTable<School>();
        Db.DropTable<Location>();
        Db.DropTable<ZipCode>();
        Db.DropTable<Unit>();
        Db.DropTable<District>();
        Db.DropTable<Council>();
    }
}
