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
    private Dictionary<string /* ClerkId */, Geolocation> _lastLocations = [];
    private Dictionary<string /* ConnectionId */, User> _activeUsers = [];

    public List<DtoGeolocation> LastLocationPerUser =>
        _lastLocations
            .Select(keyvalue => (DtoGeolocation)keyvalue.Value)
            .ToList();

    public string ConnectionIdByUserId(string userId) =>
        _activeUsers.FirstOrDefault(item => item.Value.Id == userId).Key;

    public User RegisterUser(string connectionId, DtoUser dtoUser, LetsMeetDbContext db)
    {
        _activeUsers.TryAdd(connectionId, db.AddUser(dtoUser));
        return _activeUsers[connectionId];
    }

    public void DeregisterUserByConnectionId(string connectionId)
    {
        _activeUsers.Remove(connectionId);
    }

    public List<User> ActiveUsers => [.. _activeUsers.Values];

    public void LogActiveUsers()
    {
        var itemStrings = _activeUsers.Select(item => $"{item.Value.Username} [{item.Key}]: {item.Value.Id}");
        Console.WriteLine($"Connected users:\n\t{string.Join("\n\t", itemStrings)}");
    }

    public void AddToLastLocations(string clerkId, Geolocation location)
    {
        Console.WriteLine($"Add location {location.Id} with clerkId {clerkId}");
        _lastLocations.TryAdd(clerkId, location);

        if (_lastLocations[clerkId].Timestamp < location.Timestamp)
        {
            _lastLocations[clerkId] = location;
        }
    }
}