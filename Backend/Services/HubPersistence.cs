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
    private Dictionary<string /* ConnectionId */, User> _registeredUsers = [];

    public List<DtoGeolocation> LastLocationPerUser =>
        _lastLocations
            .Select(keyvalue => (DtoGeolocation)keyvalue.Value)
            .ToList();

    public string ConnectionIdByUserId(string userId) =>
        _registeredUsers.FirstOrDefault(item => item.Value.Id == userId).Key;

    public User RegisterUser(string connectionId, DtoUser dtoUser, LetsMeetDbContext db)
    {
        _registeredUsers.TryAdd(connectionId, db.AddUser(dtoUser));
        return _registeredUsers[connectionId];
    }

    public void DeregisterUserByConnectionId(string connectionId)
    {
        _registeredUsers.TryGetValue(connectionId, out var user);

        if (user is null)
        {
            Console.WriteLine($"ERROR: user with connectionId [{connectionId}] is not registered");
            return;
        }

        _lastLocations.Remove(user.Id);

        Console.WriteLine($"Deregistered {user.Username}");
    }

    public List<User> RegisteredUsers => [.. _registeredUsers.Values];

    public void LogRegisteredUsers()
    {
        if (_registeredUsers.Count == 0)
        {
            Console.WriteLine("[No registered users]");
            return;
        }

        var itemStrings = _registeredUsers.Select(item => $"{item.Value.Username} [{item.Key}]: {item.Value.Id}");
        Console.WriteLine($"Registered users:\n\t{string.Join("\n\t", itemStrings)}");
    }

    public void LogLastLocations()
    {
        if (_lastLocations.Count == 0)
        {
            Console.WriteLine("[No last locations]");
            return;
        }

        var itemStrings = _lastLocations.Values.Select(location => $"{location.User.Username}: [{location.Latitude}, {location.Longitude}]");
        Console.WriteLine($"Last locations:\n\t{string.Join("\n\t", itemStrings)}");
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