using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models;

public class User(string username, string id)
{
    public string Id { get; set; } = id;
    public string Username { get; set; } = username;
    public List<UserLocation> Locations { get; set; } = [];

    public static readonly User Null = new();
    public User() : this("Null", "null") { }
}