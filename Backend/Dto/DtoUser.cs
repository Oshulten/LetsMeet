using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models;

public class DtoUser(string username, string id)
{
    public string Username { get; set; } = username;
    public string Id { get; set; } = id;

    public static explicit operator DtoUser(User user) =>
        new(user.Username, user.Id);
}