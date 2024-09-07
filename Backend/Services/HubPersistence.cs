using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Database;
using Backend.Dto;
using Backend.Models;

namespace Backend.Services;

public class HubPersistence
{
    public Dictionary<string /* ClerkId */, Geolocation> _lastLocations = [];
    public Dictionary<string /* ConnectionId */, User> _activeUsers = [];

    public List<DtoGeolocation> LastLocationPerUser =>
        _lastLocations
            .Select(keyvalue => (DtoGeolocation)keyvalue.Value)
            .ToList();

    public User RegisterUser(string connectionId, DtoUser dtoUser, LetsMeetDbContext db)
    {
        if (_activeUsers.Values.FirstOrDefault(u => u.Id == dtoUser.ClerkId) is null)
        {
            var existingUser = db.Users.Find(dtoUser.ClerkId) ?? db.AddUser(dtoUser);
            _activeUsers.Add(connectionId, existingUser);
        }
        return _activeUsers[connectionId];
    }

    public void DeregisterUserByConnectionId(string connectionId)
    {
        _activeUsers.Remove(connectionId);
    }

    public List<User> ActiveUsers =>
        _activeUsers.Values.ToList();

    public void LogActiveUsers()
    {
        var itemStrings = _activeUsers.Select(item => $"{item.Value.Username} [{item.Key}]: {item.Value.Id}");
        Console.WriteLine($"Connected users:\n\t{string.Join("\n\t", itemStrings)}");
    }

    public void AddToLastLocations(string clerkId, Geolocation location)
    {
        if (!_lastLocations.ContainsKey(clerkId))
        {
            _lastLocations.Add(clerkId, location);
            return;
        }

        if (_lastLocations[clerkId].Timestamp > location.Timestamp)
        {
            _lastLocations[clerkId] = location;
        }
    }
}