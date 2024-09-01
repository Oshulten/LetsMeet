using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Hubs;

public interface IGeolocationClient
{
    Task RecieveGeolocation(string message);
}