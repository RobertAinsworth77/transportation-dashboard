-- Production Database Backup Script
-- Run this FIRST before any migrations

DECLARE @BackupFileName NVARCHAR(500);
DECLARE @CurrentDateTime NVARCHAR(20);

-- Generate timestamp for backup filename
SET @CurrentDateTime = REPLACE(REPLACE(REPLACE(CONVERT(NVARCHAR(20), GETDATE(), 120), '-', ''), ':', ''), ' ', '_');
SET @BackupFileName = 'C:\Backups\itel_datasi_backup_' + @CurrentDateTime + '.bak';

-- Create backup of production database
BACKUP DATABASE [itel_datasi] 
TO DISK = @BackupFileName
WITH FORMAT, INIT, COMPRESSION;

PRINT 'Backup completed: ' + @BackupFileName;

-- Verify backup was created successfully
RESTORE VERIFYONLY 
FROM DISK = @BackupFileName;

PRINT 'Backup verification completed successfully';
