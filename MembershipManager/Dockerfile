# Stage 1: Base runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Create writable jobs directory and fix permissions
RUN mkdir -p /app/App_Data/jobs && chmod -R 777 /app/App_Data

# Stage 2: Build React client
FROM node:18-alpine AS client-build
WORKDIR /app

# Copy client package files and install dependencies
COPY MembershipManager.Client/package.json MembershipManager.Client/package-lock.json ./MembershipManager.Client/
RUN cd MembershipManager.Client && npm install

# Copy client source and build
COPY MembershipManager.Client/. ./MembershipManager.Client/
RUN cd MembershipManager.Client && npm run build

# Stage 3: Build .NET backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["MembershipManager/MembershipManager.csproj", "MembershipManager/"]
COPY ["MembershipManager.ServiceInterface/MembershipManager.ServiceInterface.csproj", "MembershipManager.ServiceInterface/"]
COPY ["MembershipManager.ServiceModel/MembershipManager.ServiceModel.csproj", "MembershipManager.ServiceModel/"]
RUN dotnet restore "./MembershipManager/MembershipManager.csproj"
COPY . .
WORKDIR "/src/MembershipManager"
RUN dotnet build "./MembershipManager.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Stage 4: Publish backend
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./MembershipManager.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Stage 5: Final image
FROM base AS final
WORKDIR /app

# Copy backend publish output
COPY --from=publish /app/publish .

# Copy React build output into wwwroot (adjust path if needed)
COPY --from=client-build /app/MembershipManager.Client/build ./wwwroot

ENTRYPOINT ["dotnet", "MembershipManager.dll"]
