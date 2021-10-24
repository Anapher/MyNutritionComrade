#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0-buster-slim AS base
WORKDIR /app
EXPOSE 80
ENV ASPNETCORE_URLS=http://0.0.0.0:80

FROM mcr.microsoft.com/dotnet/sdk:5.0-buster-slim AS build
WORKDIR /src
COPY ["Services/CommunityCatalog/CommunityCatalog/CommunityCatalog.csproj", "Services/CommunityCatalog/CommunityCatalog/"]
COPY ["Services/CommunityCatalog/CommunityCatalog.Core/CommunityCatalog.Core.csproj", "Services/CommunityCatalog/CommunityCatalog.Core/"]
COPY ["Services/CommunityCatalog/CommunityCatalog.Infrastructure/CommunityCatalog.Infrastructure.csproj", "Services/CommunityCatalog/CommunityCatalog.Infrastructure/"]
COPY ["MyNutritionComrade.Models/MyNutritionComrade.Models.csproj", "MyNutritionComrade.Models/"]
COPY ["Libs/JsonPatchGenerator/JsonPatchGenerator.csproj", "Libs/"]

RUN dotnet restore "Services/CommunityCatalog/CommunityCatalog/CommunityCatalog.csproj"

COPY ["Services/CommunityCatalog/", "Services/CommunityCatalog/"]
COPY ["MyNutritionComrade.Models/", "MyNutritionComrade.Models/"]
COPY ["Libs/", "Libs/"]

WORKDIR "/src/Services/CommunityCatalog/CommunityCatalog"

FROM build AS publish
RUN dotnet publish "CommunityCatalog.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CommunityCatalog.dll"]