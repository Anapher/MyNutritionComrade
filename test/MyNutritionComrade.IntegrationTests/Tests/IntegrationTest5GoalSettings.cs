using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.JsonPatch.Operations;
using Microsoft.Extensions.DependencyInjection;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Domain.Entities.Goal;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Extensions;
using MyNutritionComrade.IntegrationTests._Helpers;
using Newtonsoft.Json;
using Xunit;

namespace MyNutritionComrade.IntegrationTests.Tests
{
    public class GoalSettingsCase
    {
        public UserSettings? Settings { get; set; }
        public LoggedWeight? LoggedWeight { get; set; }
        public CalculateCurrentNutritionGoalResponse ExpectedResponse { get; set; }
    }

    public class IntegrationTest5GoalSettings : IClassFixture<CustomWebApplicationFactory>
    {
        public static readonly TheoryData<GoalSettingsCase> Cases = new TheoryData<GoalSettingsCase>
        {
            // fixed protein per day
            new GoalSettingsCase
            {
                Settings = new UserSettings
                {
                    PersonalInfo = new UserPersonalInfo {Birthday = new DateTime(1999, 7, 1), Gender = Gender.Male, Height = 1.75},
                    NutritionGoal = new UserNutritionGoal {{NutritionGoalCategory.Protein, new ProteinFixedNutritionGoal {ProteinPerDay = 180}}}
                },
                ExpectedResponse = new CalculateCurrentNutritionGoalResponse {ProteinPerDay = 180},
            },
            // protein by body weight without body weight specified
            new GoalSettingsCase
            {
                Settings = new UserSettings
                {
                    NutritionGoal = new UserNutritionGoal
                    {
                        {NutritionGoalCategory.Protein, new ProteinByBodyweightNutritionGoal {ProteinPerKgBodyweight = 2}}
                    }
                },
                ExpectedResponse = new CalculateCurrentNutritionGoalResponse(),
            },
            // protein by body weight
            new GoalSettingsCase
            {
                Settings = new UserSettings
                {
                    NutritionGoal = new UserNutritionGoal
                    {
                        {NutritionGoalCategory.Protein, new ProteinByBodyweightNutritionGoal {ProteinPerKgBodyweight = 2}}
                    }
                },
                LoggedWeight = new LoggedWeight(string.Empty, 80, new DateTimeOffset(2020, 6, 3, 0, 0, 0, TimeSpan.Zero)),
                ExpectedResponse = new CalculateCurrentNutritionGoalResponse {ProteinPerDay = 160},
            },
            // fixed calories
            new GoalSettingsCase
            {
                Settings = new UserSettings
                {
                    NutritionGoal = new UserNutritionGoal {{NutritionGoalCategory.Calories, new CaloriesFixedNutritionGoal {CaloriesPerDay = 2000}}}
                },
                ExpectedResponse = new CalculateCurrentNutritionGoalResponse {CaloriesPerDay = 2000},
            },
            // calculated calories without body weight specified
            new GoalSettingsCase
            {
                Settings = new UserSettings
                {
                    NutritionGoal = new UserNutritionGoal {{NutritionGoalCategory.Calories, new CaloriesMifflinStJeorNutritionGoal {PalFactor = 1.5}}}
                },
                ExpectedResponse = new CalculateCurrentNutritionGoalResponse(),
            },
            // calculated calories
            new GoalSettingsCase
            {
                Settings = new UserSettings
                {
                    PersonalInfo = new UserPersonalInfo {Birthday = new DateTime(1999, 7, 1), Gender = Gender.Male, Height = 1.75},
                    NutritionGoal = new UserNutritionGoal
                    {
                        {
                            NutritionGoalCategory.Calories,
                            new CaloriesMifflinStJeorNutritionGoal {PalFactor = 1.5, CalorieBalance = -200, CalorieOffset = 80}
                        }
                    }
                },
                LoggedWeight = new LoggedWeight(string.Empty, 80, new DateTimeOffset(2020, 6, 3, 0, 0, 0, TimeSpan.Zero)),
                ExpectedResponse = new CalculateCurrentNutritionGoalResponse
                {
                    CaloriesPerDay = (9.99 * 80 + 6.25 * 175 - 4.92 * new DateTime(1999, 7, 1).GetAge() + 5) * 1.5 - 200 + 80
                },
            },
            // calculated calories with missing personal info
            new GoalSettingsCase
            {
                Settings = new UserSettings
                {
                    PersonalInfo = new UserPersonalInfo {Birthday = new DateTime(1999, 7, 1), Gender = Gender.Male},
                    NutritionGoal = new UserNutritionGoal
                    {
                        {
                            NutritionGoalCategory.Calories,
                            new CaloriesMifflinStJeorNutritionGoal {PalFactor = 1.5, CalorieBalance = -200, CalorieOffset = 80}
                        }
                    }
                },
                LoggedWeight = new LoggedWeight(string.Empty, 80, new DateTimeOffset(2020, 6, 3, 0, 0, 0, TimeSpan.Zero)),
                ExpectedResponse = new CalculateCurrentNutritionGoalResponse(),
            },
            // without settings
            new GoalSettingsCase {ExpectedResponse = new CalculateCurrentNutritionGoalResponse()}
        };

        private readonly TestGoogleAuthValidator _authValidator;
        private readonly HttpClient _client;
        private readonly JsonSerializer _serializer;

        public IntegrationTest5GoalSettings(CustomWebApplicationFactory factory)
        {
            _client = factory.CreateClient();
            _authValidator = factory.GoogleAuthValidator;
            _serializer = factory.Services.GetRequiredService<JsonSerializer>();
        }

        [Theory]
        [MemberData(nameof(Cases))]
        public async Task Run(GoalSettingsCase testCase)
        {
            await _client.CreateAccount(_authValidator);

            if (testCase.Settings != null)
            {
                var patch = new JsonPatchDocument<UserSettings>();

                if (testCase.Settings.NutritionGoal != null)
                {
                    if (testCase.Settings.NutritionGoal.TryGetValue(NutritionGoalCategory.Protein, out var proteinGoal))
                        patch.Operations.Add(new Operation<UserSettings>("add", "/nutritionGoal/protein", null, proteinGoal));
                    if (testCase.Settings.NutritionGoal.TryGetValue(NutritionGoalCategory.Calories, out var caloriesGoal))
                        patch.Operations.Add(new Operation<UserSettings>("add", "/nutritionGoal/calories", null, caloriesGoal));
                    if (testCase.Settings.NutritionGoal.TryGetValue(NutritionGoalCategory.Calories, out var distributionGoal))
                        patch.Operations.Add(new Operation<UserSettings>("add", "/nutritionGoal/distribution", null, distributionGoal));
                }

                if (testCase.Settings.PersonalInfo != null)
                    patch.Replace(x => x.PersonalInfo, testCase.Settings.PersonalInfo);

                var response = await _client.PatchAsync("/api/v1/usersettings", new JsonContent(patch, _serializer));
                Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            }

            if (testCase.LoggedWeight != null)
            {
                var response = await _client.PutAsync($"/api/v1/loggedweight/{testCase.LoggedWeight.Timestamp:yyyy-MM-dd}", new JsonContent(testCase.LoggedWeight.Value));
                Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            }

            var res = await _client.GetAsync("/api/v1/userservice/sum_nutrition_goal");
            Assert.Equal(HttpStatusCode.OK, res.StatusCode);

            var data = await res.Content.DeserializeJsonObject<CalculateCurrentNutritionGoalResponse>(_serializer);

            Assert.Equal(testCase.ExpectedResponse.ProteinPerDay, data.ProteinPerDay);
            Assert.Equal(testCase.ExpectedResponse.CaloriesPerDay, data.CaloriesPerDay);

            if (testCase.ExpectedResponse.Distribution == null)
            {
                Assert.Null(data.Distribution);
            }
            else
            {
                Assert.NotNull(data.Distribution);
                Assert.Equal(testCase.ExpectedResponse.Distribution.Carbohydrates, data.Distribution.Carbohydrates);
                Assert.Equal(testCase.ExpectedResponse.Distribution.Fat, data.Distribution.Fat);
                Assert.Equal(testCase.ExpectedResponse.Distribution.Protein, data.Distribution.Protein);
            }
        }
    }
}
