using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models;

public class DtoUser(string username, string clerkId)
{
    public string Username { get; set; } = username;
    public string ClerkId { get; set; } = clerkId;

    public static explicit operator DtoUser(User user) =>
        new(user.Username, user.ClerkId);
}