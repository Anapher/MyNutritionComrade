using System;
using System.Linq;
using System.Threading.Tasks;
using Autofac;
using CommunityCatalog.Core;
using CommunityCatalog.Core.Errors;
using CommunityCatalog.Core.Gateways.Services;
using CommunityCatalog.Core.Options;
using CommunityCatalog.Infrastructure;
using CommunityCatalog.Infrastructure.Auth;
using CommunityCatalog.Infrastructure.Data;
using CommunityCatalog.Infrastructure.Email;
using CommunityCatalog.Services;
using FluentValidation.AspNetCore;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MyNutritionComrade.Models.Validation;

namespace CommunityCatalog
{
    public class TestEmailSender : IEmailSender
    {
        public Task SendPasswordToEmail(string receiverEmailAddress, string password)
        {
            return Task.CompletedTask;
        }
    }

    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddLogging();
            services.AddMediatR(typeof(Startup), typeof(CoreModule));

            services.Configure<VotingOptions>(Configuration.GetSection("ProductVoting"));
            services.Configure<AuthSettings>(Configuration.GetSection("AuthSettings"));
            services.Configure<JwtIssuerOptions>(Configuration.GetSection("JwtIssuerOptions"));
            services.Configure<IdentityOptions>(Configuration.GetSection("IdentityOptions"));
            services.Configure<MongoDbOptions>(Configuration.GetSection("MongoDb"));
            services.Configure<AdminOptions>(Configuration.GetSection("Admins"));

            services.AddSingleton<IEmailSender, TestEmailSender>();

            var jwtIssuerOptions = new JwtIssuerOptions();
            Configuration.GetSection("JwtIssuerOptions").Bind(jwtIssuerOptions);

            var authSettings = new AuthSettings();
            Configuration.GetSection("AuthSettings").Bind(authSettings);

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = jwtIssuerOptions.Issuer,
                ValidateAudience = true,
                ValidAudience = jwtIssuerOptions.Audience,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = authSettings.SigningCredentials.Key,
                RequireExpirationTime = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero,
            };
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(configureOptions =>
            {
                configureOptions.ClaimsIssuer = jwtIssuerOptions.Issuer;
                configureOptions.TokenValidationParameters = tokenValidationParameters;
                configureOptions.SaveToken = true;
            });

            services.AddMvc().ConfigureApiBehaviorOptions(options =>
            {
                options.InvalidModelStateResponseFactory = context =>
                {
                    var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<IMvcBuilder>>();

                    var error = new FieldValidationError(context.ModelState
                        .Where(x => x.Value.ValidationState == ModelValidationState.Invalid)
                        .ToDictionary(x => x.Key, x => x.Value.Errors.First().ErrorMessage));

                    logger.LogDebug("Invalid Model State: {@error}", error);
                    return new BadRequestObjectResult(error);
                };
            }).AddFluentValidation(fv =>
            {
                fv.RegisterValidatorsFromAssemblyContaining<Startup>();
                fv.RegisterValidatorsFromAssemblyContaining<ProductValidator>();
            }).AddNewtonsoftJson(x => JsonConfig.Apply(x.SerializerSettings));

            services.AddHostedService<MongoDbBuilder>();

            var mongoOptions = new MongoDbOptions();
            Configuration.GetSection("MongoDb").Bind(mongoOptions);

            var healthChecks = services.AddHealthChecks();
            healthChecks.AddMongoDb(mongoOptions.ConnectionString);

            services.Configure<HealthCheckPublisherOptions>(options =>
            {
                options.Predicate = check => check.Tags.Contains("ready");
            });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "CommunityCatalog", Version = "v1" });
            });

            services.AddSingleton<IEmailBlacklist, NoopBlacklist>();

            services.AddAutoMapper(typeof(PresentationMappingProfile).Assembly);
        }

        // ConfigureContainer is where you can register things directly
        // with Autofac. This runs after ConfigureServices so the things
        // here will override registrations made in ConfigureServices.
        // Don't build the container; that gets done for you by the factory.
        public void ConfigureContainer(ContainerBuilder builder)
        {
            builder.RegisterModule(new CoreModule());
            builder.RegisterModule(new InfrastructureModule());
            builder.RegisterModule(new PresentationModule());
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "CommunityCatalog v1"));
            }

            app.UseAuthentication();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHealthChecks("/health/ready",
                    new HealthCheckOptions { Predicate = check => check.Tags.Contains("ready") });

                endpoints.MapHealthChecks("/health/live", new HealthCheckOptions());
            });
        }
    }
}
