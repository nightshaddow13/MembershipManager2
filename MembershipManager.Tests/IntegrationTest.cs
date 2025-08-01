//using Funq;
//using ServiceStack;
//using NUnit.Framework;
//using MembershipManager.ServiceInterface;
//using MembershipManager.ServiceModel;

//namespace MembershipManager.Tests;

//public class IntegrationTest
//{
//    const string BaseUri = "http://localhost:2000/";
//    private readonly ServiceStackHost appHost;

//    class AppHost() : AppSelfHostBase(nameof(IntegrationTest), typeof(MyServices).Assembly)
//    {
//        public override void Configure(Container container)
//        {
//        }
//    }

//    public IntegrationTest()
//    {
//        appHost = new AppHost()
//            .Init()
//            .Start(BaseUri);
//    }

//    [OneTimeTearDown]
//    public void OneTimeTearDown() => appHost.Dispose();

//    public IServiceClient CreateClient() => new JsonServiceClient(BaseUri);

//    [Test]
//    public void Can_call_Hello_Service()
//    {
//        var client = CreateClient();

//        var response = client.Get(new Hello { Name = "World" });

//        Assert.That(response.Result, Is.EqualTo("Hello, World!"));
//    }
//}
