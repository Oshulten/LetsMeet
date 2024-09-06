using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models;

public class User(string username, string clerkId)
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Username { get; set; } = username;
    public string ClerkId { get; set; } = clerkId;
    public List<Geolocation> Locations { get; set; } = [];
    public static User Null = new User("Null", "null");
}