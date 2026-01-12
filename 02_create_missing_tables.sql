-- Migration Script: Create Missing Tables in Production
-- Run AFTER backing up production database

USE [itel_datasi];
GO

-- Create location_preferences table
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'employee_app' AND TABLE_NAME = 'location_preferences')
BEGIN
    CREATE TABLE [employee_app].[location_preferences] (
        [id] int IDENTITY(1,1) NOT NULL,
        [employee_id] int NOT NULL,
        [country] nvarchar(100) NOT NULL,
        [pickup_location] nvarchar(255) NOT NULL,
        [dropoff_location] nvarchar(255) NOT NULL,
        [preferred_timeframe] nvarchar(100) NOT NULL,
        [period_start] date NOT NULL,
        [period_end] date NOT NULL,
        [created_date] datetime2 DEFAULT (getdate()),
        [is_active] bit DEFAULT ((1)),
        CONSTRAINT [PK_location_preferences] PRIMARY KEY CLUSTERED ([id])
    );
    PRINT 'Created location_preferences table';
END
ELSE
BEGIN
    PRINT 'location_preferences table already exists';
END

-- Create route_alignment table
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'employee_app' AND TABLE_NAME = 'route_alignment')
BEGIN
    CREATE TABLE [employee_app].[route_alignment] (
        [id] int IDENTITY(1,1) NOT NULL,
        [country] nvarchar(100) NOT NULL,
        [city] nvarchar(100) NOT NULL,
        [community] nvarchar(100) NOT NULL,
        [created_date] datetime DEFAULT (getdate()),
        [is_active] bit DEFAULT ((1)),
        CONSTRAINT [PK_route_alignment] PRIMARY KEY CLUSTERED ([id])
    );
    PRINT 'Created route_alignment table';
END
ELSE
BEGIN
    PRINT 'route_alignment table already exists';
END

PRINT 'Migration script completed successfully';
