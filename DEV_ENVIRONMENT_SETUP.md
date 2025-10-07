# Transportation Dashboard - Development Environment Setup

## ✅ COMPLETED

### 1. Database Setup
- **Dev Database**: `itel_dev` (27 transportation tables)
- **Dev Secret**: `db_name_dev` = `itel_dev`
- **Same credentials**: Server, username, password remain the same

### 2. Lambda Functions
- **Created**: 58 dev Lambda functions (all with `-dev` suffix)
- **Environment**: All functions have `ENV=dev` environment variable
- **Container**: Uses same `itel_lambda_image` container
- **Timeout**: All set to 30 seconds (matching production fixes)

### 3. API Gateway
- **New Dev API**: `9wieil5vn5.execute-api.us-east-1.amazonaws.com`
- **Test Endpoint**: `/dev/dashboard/version` ✅ Working
- **React App**: Updated to use new dev API Gateway URL

### 4. Container Logic (NEEDS IMPLEMENTATION)
The container needs to be updated to check the `ENV` environment variable:
```python
# If ENV=dev, use db_name_dev secret
# If ENV=prod or not set, use db_name secret (backward compatible)
```

## 🚧 TODO

### 1. Update Container Image
The Lambda container code needs modification to:
- Check `ENV` environment variable
- Use `db_name_dev` secret when `ENV=dev`
- Remain backward compatible for production

### 2. Complete API Gateway Resources
Currently only `/dashboard/version` endpoint exists. Need to create:
- All 60+ API Gateway resources from production
- All method integrations
- All Lambda permissions

### 3. Test Development Environment
- Verify dev functions connect to `itel_dev` database
- Test React Dashboard with dev API Gateway
- Ensure no impact on production systems

## 🔧 CURRENT STATUS

**Working**: 
- Dev API Gateway: `https://9wieil5vn5.execute-api.us-east-1.amazonaws.com/dev/dashboard/version`
- React app configured to use dev API Gateway

**Next Step**: 
Update container image to handle `ENV=dev` for database selection

## 🛡️ PRODUCTION SAFETY

✅ **Zero impact on production systems**:
- All production Lambda functions unchanged
- Production API Gateway `2z9nw7bxvh` unchanged  
- Production secrets unchanged
- Production database `itel_datasi` unchanged

## 📋 RESOURCES CREATED

### Secrets
- `db_name_dev`: `itel_dev`

### Lambda Functions (58 total)
- `admin_get_version-dev`
- `admin_get_all_drivers-dev`
- `get_employee_info-dev`
- ... (55 more)

### API Gateway
- **ID**: `9wieil5vn5`
- **Name**: `transportation-api-dev`
- **Stage**: `dev`
- **URL**: `https://9wieil5vn5.execute-api.us-east-1.amazonaws.com/dev`
