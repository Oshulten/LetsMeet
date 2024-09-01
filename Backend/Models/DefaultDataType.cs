using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class DefaultDataType(int value1)
    {
        public Guid Id { get; init; } = Guid.NewGuid();
        public int Value1 { get; set; } = value1;
    }
}