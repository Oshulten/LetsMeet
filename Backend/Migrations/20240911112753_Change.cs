using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class Change : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Longitude",
                table: "Locations",
                newName: "Lng");

            migrationBuilder.RenameColumn(
                name: "Latitude",
                table: "Locations",
                newName: "Lat");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Lng",
                table: "Locations",
                newName: "Longitude");

            migrationBuilder.RenameColumn(
                name: "Lat",
                table: "Locations",
                newName: "Latitude");
        }
    }
}
