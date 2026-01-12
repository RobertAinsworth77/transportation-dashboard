-- Verification Script: Check Migration Results
-- Run AFTER migration scripts to verify data integrity

USE [itel_datasi];
GO

PRINT '=== MIGRATION VERIFICATION REPORT ===';
PRINT '';

-- Check if new tables exist
PRINT '1. Checking for new tables:';
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'employee_app' AND TABLE_NAME = 'location_preferences')
    PRINT '   ✓ location_preferences table exists'
ELSE
    PRINT '   ✗ location_preferences table MISSING'

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'employee_app' AND TABLE_NAME = 'route_alignment')
    PRINT '   ✓ route_alignment table exists'
ELSE
    PRINT '   ✗ route_alignment table MISSING'

PRINT '';

-- Check table counts
PRINT '2. Table record counts:';
DECLARE @count INT;

SELECT @count = COUNT(*) FROM employee_app.trip_table;
PRINT '   trip_table: ' + CAST(@count AS VARCHAR(10)) + ' records';

SELECT @count = COUNT(*) FROM employee_app.route_table;
PRINT '   route_table: ' + CAST(@count AS VARCHAR(10)) + ' records';

SELECT @count = COUNT(*) FROM employee_app.stop_table;
PRINT '   stop_table: ' + CAST(@count AS VARCHAR(10)) + ' records';

SELECT @count = COUNT(*) FROM employee_app.sites_table;
PRINT '   sites_table: ' + CAST(@count AS VARCHAR(10)) + ' records';

SELECT @count = COUNT(*) FROM employee_app.location_preferences;
PRINT '   location_preferences: ' + CAST(@count AS VARCHAR(10)) + ' records';

SELECT @count = COUNT(*) FROM employee_app.route_alignment;
PRINT '   route_alignment: ' + CAST(@count AS VARCHAR(10)) + ' records';

PRINT '';
PRINT '=== VERIFICATION COMPLETE ===';
