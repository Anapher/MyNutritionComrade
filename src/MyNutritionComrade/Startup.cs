using Autofac;
using Autofac.Extensions.DependencyInjection;
using AutoMapper;
using MyNutritionComrade.Core;
using MyNutritionComrade.Core.Errors;
using MyNutritionComrade.Infrastructure;
using MyNutritionComrade.Infrastructure.Auth;
using MyNutritionComrade.Infrastructure.Helpers;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Swashbuckle.AspNetCore.Swagger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using MyNutritionComrade.Config;
using MyNutritionComrade.Core.Domain.Entities.Consumption;
using MyNutritionComrade.Core.Domain.Validation;
using MyNutritionComrade.Core.Options;
using MyNutritionComrade.Infrastructure.Converter;
using MyNutritionComrade.Models.Response;
using MyNutritionComrade.Selectors;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;

namespace MyNutritionComrade
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        private static void ConfigureJsonSerializerSettings(JsonSerializerSettings settings)
        {
            settings.Converters.AddRequiredConverters();
            settings.Converters.Add(new StringEnumConverter(new CamelCaseNamingStrategy()));
            settings.Converters.Add(new AbstractTypeJsonConverter<SearchResult, SearchResultType>(new Dictionary<SearchResultType, Type>
            {
                {SearchResultType.Meal, typeof(MealSuggestion)}, {SearchResultType.Product, typeof(ProductSuggestion)}
            }) {TypePropertyName = nameof(SearchResult.Type)});
            settings.Converters.Add(new AbstractTypeJsonConverter<FoodPortionDto, FoodPortionType>(new Dictionary<FoodPortionType, Type>
            {
                {FoodPortionType.Product, typeof(FoodPortionProductDto)},
                {FoodPortionType.Meal, typeof(FoodPortionMealDto)},
                {FoodPortionType.Custom, typeof(FoodPortionCustomDto)},
                {FoodPortionType.Suggestion, typeof(FoodPortionSuggestedDto)},
            }) {TypePropertyName = nameof(FoodPortionDto.Type)});

            settings.ContractResolver = new CamelCasePropertyNamesContractResolver();
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            services.AddLogging();

            // Register the ConfigurationBuilder instance of AuthSettings
            var authSettings = Configuration.GetSection(nameof(AuthSettings));
            services.Configure<AuthSettings>(authSettings);
            services.Configure<VotingOptions>(Configuration.GetSection("ProductVoting"));
            services.Configure<GoogleOAuthOptions>(Configuration.GetSection("GoogleOAuth"));

            var signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(authSettings[nameof(AuthSettings.SecretKey)]));

            // jwt wire up
            // Get options from app settings
            var jwtAppSettingOptions = Configuration.GetSection(nameof(JwtIssuerOptions));

            // Configure JwtIssuerOptions
            services.Configure<JwtIssuerOptions>(options =>
            {
                options.Issuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)];
                options.Audience = jwtAppSettingOptions[nameof(JwtIssuerOptions.Audience)];
                options.SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);
            });

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)],

                ValidateAudience = true,
                ValidAudience = jwtAppSettingOptions[nameof(JwtIssuerOptions.Audience)],

                ValidateIssuerSigningKey = true,
                IssuerSigningKey = signingKey,

                RequireExpirationTime = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

            }).AddJwtBearer(configureOptions =>
            {
                configureOptions.ClaimsIssuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)];
                configureOptions.TokenValidationParameters = tokenValidationParameters;
                configureOptions.SaveToken = true;

                configureOptions.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];
                        if (!string.IsNullOrEmpty(accessToken))
                            context.Token = accessToken;
                        return Task.CompletedTask;
                    }
                };
            });

            // api user claim policy
            services.AddAuthorization(options =>
            {
                options.AddPolicy("ApiUser", policy => policy.RequireClaim(Constants.Strings.JwtClaimIdentifiers.Rol, Constants.Strings.JwtClaims.ApiAccess));
            });

            services.AddRavenDb(Configuration.GetSection("RavenDb"));

            var jsonSettings = new JsonSerializerSettings();
            ConfigureJsonSerializerSettings(jsonSettings);

            services.AddSingleton(JsonSerializer.Create(jsonSettings));

            services.AddMvc().ConfigureApiBehaviorOptions(options =>
            {
                options.InvalidModelStateResponseFactory = context =>
                {
                    var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<IMvcBuilder>>();

                    var error = new FieldValidationError(context.ModelState.Where(x => x.Value.ValidationState == ModelValidationState.Invalid)
                        .ToDictionary(x => x.Key, x => x.Value.Errors.First().ErrorMessage));

                    logger.LogDebug("Invalid Model State: {@error}", error);
                    return new BadRequestObjectResult(error);
                };
            }).AddFluentValidation(fv =>
            {
                fv.RegisterValidatorsFromAssemblyContaining<Startup>();
                fv.RegisterValidatorsFromAssemblyContaining<ProductInfoValidator>();
            }).AddNewtonsoftJson(x => ConfigureJsonSerializerSettings(x.SerializerSettings));

            services.AddAutoMapper(Assembly.GetExecutingAssembly(), typeof(InfrastructureModule).Assembly);

            // In production, the React files will be served from this directory
            //services.AddSpaStaticFiles(configuration =>
            //{
            //    configuration.RootPath = "ClientApp/build";
            //});

            // Register the Swagger generator, defining 1 or more Swagger documents
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo {Title = "My Nutrition Comrade API", Version = "v1"});

                var scheme = new OpenApiSecurityScheme
                {
                    Description = @"JWT Authorization header using the Bearer scheme. \r\n\r\n 
                      Enter 'Bearer' [space] and then your token in the text input below.
                      \r\n\r\nExample: 'Bearer 12345abcdef'",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                };

                // Swagger 2.+ support
                c.AddSecurityDefinition("Bearer", scheme);
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference {Type = ReferenceType.SecurityScheme, Id = "Bearer"},
                            Scheme = "oauth2",
                            Name = "Bearer",
                            In = ParameterLocation.Header,
                        },
                        new List<string>()
                    }
                });
                c.AddFluentValidationRules();
                c.ResolveConflictingActions(enumerable => enumerable.First());
            });
            services.AddSwaggerGenNewtonsoftSupport();

            // Now register our services with Autofac container.
            var builder = new ContainerBuilder();

            builder.RegisterModule(new CoreModule());
            builder.RegisterModule(new InfrastructureModule());
            builder.RegisterModule(new PresentationModule());

            builder.Populate(services);
            var container = builder.Build();

            // Create the IServiceProvider based on the container.
            return new AutofacServiceProvider(container);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.CreateRavenDbIndexes();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), 
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "My Nutrition Comrade API V1"));

            // app.UseHttpsRedirection();
            app.UseStaticFiles();
            //app.UseSpaStaticFiles();

            app.UseAuthentication();
            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute("default", "{controller}/{action=Index}/{id?}");
            });

            //app.UseSpa(spa =>
            //{
            //    spa.Options.SourcePath = "ClientApp";

            //    if (env.IsDevelopment())
            //    {
            //        // uncomment this if you want the React app to start with ASP.Net Core (else you have to start it manually)
            //        //spa.UseReactDevelopmentServer(npmScript: "start"); 
            //        spa.UseProxyToSpaDevelopmentServer("http://localhost:3000");
            //    }
            //});
        }
    }
}
