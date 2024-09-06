using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dto;
using Backend.Models;

namespace Backend.Services;

public class HubPersistence
{
    public Dictionary<string, Geolocation> _lastLocations { get; set; } = [];

    public List<DtoGeolocation> LastLocationPerUser =>
        _lastLocations
            .Select(keyvalue => (DtoGeolocation)keyvalue.Value)
            .ToList();

    public void AddToLastLocations(string connectionId, Geolocation location)
    {
        if (!_lastLocations.ContainsKey(connectionId))
        {
            _lastLocations.Add(connectionId, location);
            return;
        }

        if (_lastLocations[connectionId].Timestamp > location.Timestamp)
        {
            _lastLocations[connectionId] = location;
        }
    }
}