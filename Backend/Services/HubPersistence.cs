using Backend.Database;
using Backend.Dto;
using Backend.Models;

namespace Backend.Services;

public class HubPersistence
{
    private class UserRegistration(DtoUser user, string connectionId, LatLng? lastLocation)
    {
        public DtoUser User { get; set; } = user;
        public string ConnectionId { get; set; } = connectionId;
        public LatLng? LastLocation { get; set; } = lastLocation;
    };

    private List<UserRegistration> _userRegistrations = [];

    public void RegisterUser(string connectionId, DtoUser user, LetsMeetDbContext db)
    {
        _userRegistrations = _userRegistrations
            .Where(registration => registration.User.Id != user.Id)
            .ToList();

        _userRegistrations.Add(new UserRegistration((DtoUser)db.AddUser(user), connectionId, null));
    }

    public void DeregisterUserByConnectionId(string connectionId)
    {
        var user = _userRegistrations.FirstOrDefault(registration => registration.ConnectionId == connectionId);

        if (user is null)
        {
            return;
        }

        _userRegistrations = _userRegistrations
            .Where(registration => registration.User.Id != user.User.Id)
            .ToList();
    }

    public List<DtoUserLocation> LastLocations =>
         _userRegistrations
            .Where(registration => registration.LastLocation != null)
            .Select(registration => new DtoUserLocation(registration.User, registration.LastLocation!))
            .ToList();

    public void UpdateLastLocation(DtoUserLocation userLocation, LetsMeetDbContext db)
    {
        var userRegistration = _userRegistrations.FirstOrDefault(registration => registration.User.Id == userLocation.User.Id);

        if (userRegistration is null)
        {
            Console.WriteLine($"[{nameof(HubPersistence)} - {nameof(UpdateLastLocation)}] [ERROR]: {userLocation.User.Username} is not registered");
            return;
        }

        db.AddGeolocation(userLocation);

        userRegistration.LastLocation = userLocation.Location;
    }

    public string? ConnectionIdByUser(DtoUser user) =>
        _userRegistrations.FirstOrDefault(registration => registration.User.Id == user.Id)?.ConnectionId;

    public void LogRegisteredUsers()
    {
        if (_userRegistrations.Count == 0)
        {
            Console.WriteLine($"[{nameof(HubPersistence)} - {nameof(UpdateLastLocation)}]: No registered users");
            return;
        }

        var itemStrings = _userRegistrations.Select(registration => $"{registration.User.Username} [{registration.ConnectionId}]: {registration.ConnectionId ?? "[No last location]"}");
        Console.WriteLine($"Registered users:\n\t{string.Join("\n\t", itemStrings)}");
    }
}