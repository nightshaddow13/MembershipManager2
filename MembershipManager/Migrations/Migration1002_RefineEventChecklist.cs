using ServiceStack.DataAnnotations;
using ServiceStack.OrmLite;

namespace MembershipManager.Migrations;

public class Migration1002_RefineEventChecklist : MigrationBase
{
    class Event
    {
        [RemoveColumn]
        public bool IsConfirmed { get; set; }

        [AddColumn]
        [Default(0)]
        public bool IsConfirmedBySchool { get; set; } = false;

        [AddColumn]
        [Default(0)]
        public bool IsConfirmedByUnit { get; set; } = false;

        [RemoveColumn]
        public bool AreFlyersOrdered { get; set; }

        [AddColumn]
        [Default(0)]
        public bool NeedsHalfSheetFlyers { get; set; } = false;

        [AddColumn]
        [Default(0)]
        public bool AreHalfSheetFlyersOrdered { get; set; } = false;

        [AddColumn]
        [Default(0)]
        public bool AreHalfSheetFlyersDelivered { get; set; } = false;

        [AddColumn]
        [Default(0)]
        public bool NeedsFullSheetFlyers { get; set; } = false;

        [AddColumn]
        [Default(0)]
        public bool AreFullSheetFlyersOrdered { get; set; } = false;

        [AddColumn]
        [Default(0)]
        public bool AreFullSheetFlyersDelivered { get; set; } = false;
    }

    public override void Up()
    {
        Db.Migrate<Event>();
    }

    public override void Down()
    {
        Db.Revert<Event>();
    }
}
