using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MembershipManager.Data;
using MembershipManager.ServiceInterface;
using Azure.Identity;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.DataProtection.KeyManagement.Internal;
using Azure.Security.KeyVault.Keys.Cryptography;

AppHost.RegisterKey();

var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;

services.AddDatabaseDeveloperPageExceptionFilter();

services.AddAuthorization();
services.AddIdentity<ApplicationUser, IdentityRole>(options => {
        //options.User.AllowedUserNameCharacters = null;
        options.SignIn.RequireConfirmedAccount = true;
    })
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddSignInManager()
    .AddDefaultTokenProviders();

services.ConfigureApplicationCookie(options => options.DisableRedirectsForApis());

//// Data Protection keys folder on Linux App Service
//var keyStorageDirectory = "/home/data_protection_keys";

//// Ensure directory exists
//if (!Directory.Exists(keyStorageDirectory))
//{
//    Directory.CreateDirectory(keyStorageDirectory);
//}

//builder.Services.AddDataProtection()
//    .PersistKeysToFileSystem(new DirectoryInfo(keyStorageDirectory));

// Add application services.
services.AddSingleton<IEmailSender<ApplicationUser>, IdentityNoOpEmailSender>();
// Uncomment to send emails with SMTP, configure SMTP with "SmtpConfig" in appsettings.json
// services.AddSingleton<IEmailSender<ApplicationUser>, EmailSender>();
services.AddScoped<IUserClaimsPrincipalFactory<ApplicationUser>, AdditionalUserClaimsPrincipalFactory>();

// Register all services
services.AddServiceStack(typeof(MyServices).Assembly);

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseMigrationsEndPoint();
    
    // Serve static files from the /public/img directory during development
    app.MapGet("/img/{**path}", async (string path, HttpContext ctx) => {
        var file = Path.GetFullPath($"{app.Environment.ContentRootPath}/../MembershipManager.Client/public/img/{path}");
        if (File.Exists(file))
        {
            ctx.Response.ContentType = MimeTypes.GetMimeType(path);
            await ctx.Response.SendFileAsync(file);
        }
        else
        {
            ctx.Response.StatusCode = 404;
        }
    });
}
else
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.MapFallbackToFile("/index.html");

app.UseAuthorization();

app.UseServiceStack(new AppHost(), options =>
{
    options.MapEndpoints();
});

app.Run();
