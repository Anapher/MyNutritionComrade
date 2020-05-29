using MyNutritionComrade.Infrastructure.Auth;
using System;
using System.Text;
using Xunit;
using Microsoft.IdentityModel.Tokens;
using Moq;
using MyNutritionComrade.Infrastructure.Interfaces;
using System.IdentityModel.Tokens.Jwt;

namespace MyNutritionComrade.Infrastructure.Tests.Auth
{
    public class JwtFactoryUnitTests
    {
        [Fact]
        public async void GenerateEncodedToken_GivenValidInputs_ReturnsExpectedTokenData()
        {
            // arrange
            var token = Guid.NewGuid().ToString();
            var id = Guid.NewGuid().ToString();
            var jwtIssuerOptions = new JwtIssuerOptions
            {
                Issuer = "",
                Audience = "",
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.ASCII.GetBytes("secret_key")), SecurityAlgorithms.HmacSha256)
            };

            var mockJwtTokenHandler = new Mock<IJwtHandler>();
            mockJwtTokenHandler.Setup(handler => handler.WriteToken(It.IsAny<JwtSecurityToken>())).Returns(token);

            var jwtFactory = new JwtFactory(mockJwtTokenHandler.Object, Microsoft.Extensions.Options.Options.Create(jwtIssuerOptions));

            // act
            var result = await jwtFactory.GenerateEncodedToken(id);

            // assert
            Assert.Equal(token, result);
        }
    }
}
