using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models;

public class LatLng(double lat, double lng)
{
    public double Lat { get; set; } = lat;
    public double Lng { get; set; } = lng;

    public override string ToString() =>
        $"({Lat}, {Lng})";

    public static readonly LatLng Null = new();

    public LatLng() : this(0, 0) { }
}