using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models;

public class User(string username, string clerkId)
{
    public string Id { get; set; } = clerkId;
    public string Username { get; set; } = username;
    public List<Geolocation> Locations { get; set; } = [];
    public static User Null = new User("Null", "null");

    public User() : this(Null.Username, Null.Id) { }
}