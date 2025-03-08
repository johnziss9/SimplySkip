﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SimplySkip.Migrations
{
    /// <inheritdoc />
    public partial class RemoveCustomerAddress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "Customers");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Customers",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
