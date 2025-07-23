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

        [AddColumn]
        [Default(0)]
        public bool NeedFlyers { get; set; } = false;

        [AddColumn]
        [Default(0)]
        public bool AreFlyersDelivered { get; set; } = false;
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
