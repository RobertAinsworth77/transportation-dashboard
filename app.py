from config import connstring

import json
import datetime
import decimal

import os
import boto3
import pandas as pd

import pyodbc

import math


class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (datetime.datetime, datetime.date)):
            return obj.isoformat()
        elif isinstance(obj, decimal.Decimal):
            return float(obj)
        elif pd.isna(obj):
            return None
        return super().default(obj)




# Database connection helper
def get_db_connection():
    """Get database connection based on environment"""
    env = os.environ.get('ENV', 'prod')
    print(f"🔍 Environment detected: {env}")
    
    # Initialize secrets manager client
    session = boto3.session.Session()
    client = session.client(service_name='secretsmanager', region_name='us-east-1')
    
    if env == 'dev':
        print("🔧 Using dev database configuration")
        try:
            # Get dev database credentials from Secrets Manager
            print("📡 Retrieving dev database secrets...")
            
            print("🔍 Getting db_name_dev...")
            db_name = client.get_secret_value(SecretId='db_name_dev')['SecretString']
            print(f"✅ DB Name: {db_name}")
            
            print("🔍 Getting db_user_dev...")
            db_user = client.get_secret_value(SecretId='db_user_dev')['SecretString'] 
            print(f"✅ DB User: {db_user}")
            
            print("🔍 Getting db_password_dev...")
            db_password = client.get_secret_value(SecretId='db_password_dev')['SecretString']
            print("✅ DB Password retrieved")
            
        except Exception as e:
            print(f"❌ Error retrieving dev secrets: {str(e)}")
            raise e
    else:
        print("🏭 Using production database configuration")
        try:
            # Get production database credentials from Secrets Manager
            print("📡 Retrieving production database secrets...")
            
            print("🔍 Getting db_name_prod...")
            db_name = client.get_secret_value(SecretId='db_name_prod')['SecretString']
            print(f"✅ DB Name: {db_name}")
            
            print("🔍 Getting db_user_prod...")
            db_user = client.get_secret_value(SecretId='db_user_prod')['SecretString'] 
            print(f"✅ DB User: {db_user}")
            
            print("🔍 Getting db_password_prod...")
            db_password = client.get_secret_value(SecretId='db_password_prod')['SecretString']
            print("✅ DB Password retrieved")
            
        except Exception as e:
            print(f"❌ Error retrieving production secrets: {str(e)}")
            raise e
    
    # Database connection parameters
    server = 'itel-db-server.database.windows.net'
    port = '1433'
    
    print(f"🔗 Connecting to: {server}:{port}")
    print(f"🗄️ Database: {db_name}")
    print(f"👤 User: {db_user}")
    
    try:
        # Create connection string for Azure SQL Database
        connection_string = f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server},{port};DATABASE={db_name};UID={db_user};PWD={db_password};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;'
        print("🔌 Attempting database connection...")
        
        connection = pyodbc.connect(connection_string)
        print("✅ Database connection successful!")
        return connection
        
    except Exception as e:
        print(f"❌ Database connection failed: {str(e)}")
        raise e
    
    # Initialize secrets manager client
    secrets_client = boto3.client('secretsmanager', region_name='us-east-1')
    
    try:
        # Get database name based on environment
        if env == 'dev':
            print("📋 Using dev environment - fetching dev secrets")
            db_name = secrets_client.get_secret_value(SecretId='db_name_dev')['SecretString']
            print(f"📋 Dev database name: {db_name}")
        else:
            print("📋 Using prod environment - fetching prod secrets")
            db_name = secrets_client.get_secret_value(SecretId='db_name')['SecretString']
            print(f"📋 Prod database name: {db_name}")
        
        # Get other connection details (same for all environments)
        hostname = secrets_client.get_secret_value(SecretId='db_server')['SecretString']
        print(f"🖥️ Database server: {hostname}")
        
        if env == 'dev':
            username = secrets_client.get_secret_value(SecretId='db_user_dev')['SecretString']
            password = secrets_client.get_secret_value(SecretId='db_password_dev')['SecretString']
            print(f"👤 Dev credentials - user: {username}")
        else:
            username = secrets_client.get_secret_value(SecretId='db_user')['SecretString']
            password = secrets_client.get_secret_value(SecretId='db_password')['SecretString']
            print(f"👤 Prod credentials - user: {username}")
        
        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={db_name};UID={username};PWD={password}"
        print(f"🔗 Connection string: DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={db_name};UID={username};PWD=***")
        
        conn = pyodbc.connect(connstring, autocommit=False)
        print("✅ Database connection successful!")
        return conn
        
    except Exception as e:
        print(f"❌ Error connecting to database: {e}")
        print("🔄 Falling back to hardcoded production connection")
        # Fallback to hardcoded values for backward compatibility
        hostname = "itel-db-server.database.windows.net"
        username = "scripting"
        password = "0O%9d22lF$mIre6dCWue"
        database = "itel_datasi"
        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"
        print(f"🔗 Fallback connection: DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD=***")
        return pyodbc.connect(connstring, autocommit=False)


def handler(event, context):

    print("Event received:", json.dumps(event))

    # Handle API Gateway events
    if "httpMethod" in event and "resource" in event:
        print("API Gateway event detected")
        
        # Route based on resource path
        resource = event.get("resource", "")
        method = event.get("httpMethod", "")
        
        if resource == "/dashboard/route-alignments" and method == "GET":
            print("Routing to admin_get_route_alignments")
            return admin_get_route_alignments(event, context)
        elif resource == "/dashboard/route-alignments/filters" and method == "GET":
            print("Routing to admin_get_route_alignment_filters")
            return admin_get_route_alignment_filters(event, context)
        elif resource == "/dashboard/route-alignments" and method == "POST":
            print("Routing to admin_create_route_alignment")
            return admin_create_route_alignment(event, context)
        elif resource == "/dashboard/route-alignments/{id}" and method == "PUT":
            print("Routing to admin_update_route_alignment")
            return admin_update_route_alignment(event, context)
        elif resource == "/dashboard/route-alignments/{id}" and method == "DELETE":
            print("Routing to admin_delete_route_alignment")
            return admin_delete_route_alignment(event, context)
        elif resource == "/dashboard/location-preferences" and method == "GET":
            print("Routing to admin_get_location_preferences_summary")
            return admin_get_location_preferences_summary(event, context)
        elif resource == "/dashboard/location-preferences" and method == "POST":
            print("Routing to admin_create_location_preference")
            return admin_create_location_preference(event, context)
        elif resource == "/dashboard/location-preferences/summary" and method == "GET":
            print("Routing to admin_get_location_preferences_summary")
            return admin_get_location_preferences_summary(event, context)
        elif resource == "/dashboard/location-preferences/country/{country}" and method == "GET":
            print("Routing to admin_get_location_preferences_by_country")
            return admin_get_location_preferences_by_country(event, context)
        elif resource == "/dashboard/users/drivers" and method == "POST":
            print("Routing to admin_get_all_drivers")
            return admin_get_all_drivers(event, context)
        elif resource == "/dashboard/trips/move-employee" and method == "POST":
            print("Routing to move_employee_between_trips")
            return move_employee_between_trips(event, context)
        # Employee app endpoints - use environment variable routing
        elif resource.startswith("/employee_") or resource.startswith("/get_employee_") or resource.startswith("/get_driver_"):
            env_func_name = os.environ.get('LAMBDA_FUNCTION_NAME')
            if env_func_name and env_func_name in lambdas_functions:
                print(f"Routing employee endpoint to: {env_func_name}")
                try:
                    body = lambdas_functions[env_func_name](event, context)
                    # Return proper API Gateway proxy response
                    return {
                        "statusCode": body.get("statusCode", 200),
                        "headers": {
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
                        },
                        "body": json.dumps(body)
                    }
                except Exception as e:
                    print(f"Error in {env_func_name}:", str(e))
                    return {
                        "statusCode": 500,
                        "headers": {
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
                        },
                        "body": json.dumps({"message": f"Internal error: {str(e)}"})
                    }
        else:
            return {
                "statusCode": 404,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
                },
                "body": json.dumps({"message": f"Resource {resource} with method {method} not found"})
            }

    # Handle direct Lambda invocation
    elif "lambda_function_name" in event:

        func_name = event["lambda_function_name"]

        print(f"Dispatching to: {func_name}")

        if func_name in lambdas_functions:



            try:

                body = lambdas_functions[func_name](event, context)

                print("Response body:", body)

                return { "body": body }

            except Exception as e:

                print("Internal lambda error:", str(e))

                return {

                    "statusCode": 500,

                    "body": {"message": "Internal lambda function failed."}

                }

        else:

            return {

                "statusCode": 400,

                "body": {"message": f"Lambda function '{func_name}' not found in repository."}

            }

            

    else:
        # Check if we have a LAMBDA_FUNCTION_NAME environment variable
        env_func_name = os.environ.get('LAMBDA_FUNCTION_NAME')
        if env_func_name and env_func_name in lambdas_functions:
            print(f"Using environment function name: {env_func_name}")
            event["lambda_function_name"] = env_func_name
            
            try:
                body = lambdas_functions[env_func_name](event, context)
                print("Response body:", body)
                return { "body": body }
            except Exception as e:
                print("Internal lambda error:", str(e))
                return {
                    "statusCode": 500,
                    "body": {"message": "Internal lambda function failed."}
                }
        else:
            response = {
                "statusCode": 400,
                "body": {
                    "message": "lambda_function_name key is missing as element on event"
                }
            }
            return response



def get_prev_trip(event, context):

    """

    

    """

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "reporting"

        password = "H5ysh=ZDZtae~r{7B*Q8"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        driver_id = event.get('driver_id')

        conn = get_db_connection()

        query = f"""

                    SELECT * FROM employee_app.trip_table where driver_id = {driver_id} and status='completed';

                """

        df = pd.read_sql_query(query, conn, params=None)

        df["date_begin"] = df["date_begin"].astype(str)

        df["date_end"] = df["date_end"].astype(str)

        body = {

            "statusCode": 200,

            "message": "The trip information was obtained successfully", 

            "data": df.to_dict("records")

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def get_possible_trips(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "reporting"

        password = "H5ysh=ZDZtae~r{7B*Q8"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        conn = get_db_connection()

        driver_id = event.get('driver_id')

        query = f"""SELECT A.*, B.route_name, C.capacity FROM employee_app.trip_table A

                    join employee_app.route_table B

                    on A.route_id = B.route_id

					join employee_app.vehicle_table C

					on A.vehicle_id = C.vehicle_id

                    where date_begin >= cast(CONVERT(Date, SWITCHOFFSET(SYSDATETIMEOFFSET(), DATEPART(TZOFFSET,SYSDATETIMEOFFSET() AT TIME ZONE 'Central Standard Time'))) as Date) and driver_id = {driver_id} and a.status= 'pending';

                """

        #where date_begin >= CAST( GETDATE() AS Date ) and driver_id = {driver_id} and status= 'pending';

        df = pd.read_sql_query(query, conn, params=None)

        df["date_begin"] = df["date_begin"].astype(str)

        df["date_end"] = df["date_end"].astype(str)

        body = {

            "statusCode": 200,

            "message": "Today's trips were successfully obtained", 

            "data": df.to_dict("records")#json.loads(df.to_json())

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body

        

def get_driver_current_trip(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "reporting"

        password = "H5ysh=ZDZtae~r{7B*Q8"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        driver_id = event.get('driver_id')

        conn = get_db_connection()

        query = f"""

                    SELECT  A.*, B.route_name, B.start_point, B.end_point_point, C.capacity FROM employee_app.trip_table A

                    join employee_app.route_table B

                    on A.route_id = B.route_id

					join employee_app.vehicle_table C

					on A.vehicle_id = C.vehicle_id

                    where A.driver_id = {driver_id} and A.status='in progress';

                """

        df = pd.read_sql_query(query, conn, params=None)

        df["date_begin"] = df["date_begin"].astype(str)

        df["date_end"] = df["date_end"].astype(str)

        body = {

            "statusCode": 200,

            "message": "Driver's current trip was successfully obtained", 

            "data": df.to_dict("records")

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting trip. {e}",

            "data": ""

        } 

    return body



def add_passenger_to_trip(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "scripting"

        password = "0O%9d22lF$mIre6dCWue"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        hrm_id = event.get('hrm_id')

        trip_id = event.get('trip_id')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        query = f"""IF EXISTS (select * from employee_app.reserve_table where employee_id={hrm_id} and trip_id={trip_id} and flaq='pending')

                    BEGIN

                        DECLARE @flag   NVARCHAR(30),

                                @Query  NVARCHAR(MAX)

                        SET @flag = 'completed'

                        SET @Query = N'UPDATE employee_app.reserve_table set flaq=@flaq where employee_id={hrm_id} and trip_id={trip_id} and flaq=''pending'''       

                        EXECUTE sp_executesql @Query,N'@flaq NVARCHAR(30)', @flaq = @flag

                    END

                    ELSE

                    BEGIN

                        DECLARE @condicion BIT;

						DECLARE @rows INT;

								SET @rows = (

									select COUNT(c.reserve_id) as a

									from employee_app.trip_table a

									join employee_app.vehicle_table b

									on a.vehicle_id=b.vehicle_id

									join employee_app.reserve_table c

									on a.trip_id = c.trip_id

									where c.flaq in ('completed','pending')

									and a.trip_id = {trip_id}

						

								);

								SET @condicion = (

									select 

										CASE WHEN @rows < b.capacity THEN 'TRUE' ELSE 'FALSE' END AS flag

										from employee_app.trip_table a

										join employee_app.vehicle_table b

										on a.vehicle_id=b.vehicle_id

										and a.trip_id = {trip_id}

										group by a.trip_id, b.capacity



								);

								select @rows, @condicion

								IF NOT EXISTS (

									select * from employee_app.reserve_table where employee_id={hrm_id} and trip_id={trip_id} and flaq in ('completed','pending')

								) AND @condicion = 'TRUE'

								BEGIN

									INSERT INTO employee_app.reserve_table ([employee_id],[trip_id],[reservation_date],[flaq])

									VALUES ({hrm_id},{trip_id},cast(CONVERT(datetime, SWITCHOFFSET(SYSDATETIMEOFFSET(), DATEPART(TZOFFSET,SYSDATETIMEOFFSET() AT TIME ZONE 'Central Standard Time'))) as datetime),'completed')

								END

                    END

                """

        cursor.execute(query)

        cursor.commit()

        cursor.close()

        conn.close()

        conn = get_db_connection()

        query = f"""

                    select * from employee_app.reserve_table 

                    where employee_id={hrm_id} and trip_id={trip_id} and flaq= 'completed';

                """

        df = pd.read_sql_query(query, conn, params=None)

        if len(df.to_dict("records"))==0:

            body = {

                    "statusCode": 400,

                    "message": "No bookings available",

                    "keyName": "NoSpaceAvailable"

            }

        else:

            body = {

                    "statusCode": 200,

                    "message": "Row inserted", 

                    "data": ""

            }

    

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting trip. {e}",

            "data": ""

        }      

    return body

##Lambda de Andrés

def pre_signup_validations(event, context):

    """

    

    """

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "reporting"

        password = "H5ysh=ZDZtae~r{7B*Q8"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        email = event.get('email')

        conn = get_db_connection()

        query = f"""

                    SELECT e.email 

                    FROM employee_app.employee_table as e

                    where e.email = '{email}';

                """

        answer = pd.read_sql_query(query, conn, params=None)

        

        if answer is None:

            answer = "Employee email doesn't exist"

        body = {

            "statusCode": 200,

            "message": "The trip information was obtained successfully", 

            "data": answer.to_json()

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": "An error has occur in the data base"

        } 

    return body



#Lambdas de Ale

def check_passenger_reserve(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "reporting"

        password = "H5ysh=ZDZtae~r{7B*Q8"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        hrm_id = event.get('hrm_id')

        conn = get_db_connection()

        query = f"""

                    SELECT employee_id as hrm_id, name, last_name FROM employee_app.employee_table where employee_id = {hrm_id};

                """

        df = pd.read_sql_query(query, conn, params=None)

        body = {

            "statusCode": 200,

            "message": "Employee information successfully obtained", 

            "data": df.to_dict("records")#.replace(' ', '')#.replace('[', '').replace(']', '')

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting employee. {e}",

            "data": ""

        } 

    return body 

        

    return body



def start_trip(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "scripting"

        password = "0O%9d22lF$mIre6dCWue"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        trip_id = event.get('trip_id')

        driver_id = event.get('driver_id')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        query = f"""

                    UPDATE employee_app.trip_table set status= 'in progress', driver_id = {driver_id} where trip_id = ?;

                """

        data= [trip_id]

        cursor.executemany(query,[data])

        cursor.commit()

        cursor.close()

        conn.close()

        conn2 = get_db_connection()

        query1 = f"""

                    select A.trip_id, B.route_name, B.route_description from

                    employee_app.trip_table A

                    join employee_app.route_table B

                    on A.route_id=B.route_id

                    where A.trip_id = {trip_id};

                """

        df = pd.read_sql_query(query1, conn2, params=None)

        body = {

            "statusCode": 200,

            "message": "Trip information successfully obtained", 

            "data": df.to_dict("records")

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while starting trip. {e}",

            "data": ""

        } 

        

    return body



def end_trip(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "scripting"

        password = "0O%9d22lF$mIre6dCWue"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        trip_id = event.get('trip_id')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        query = f"""

                    UPDATE employee_app.trip_table set date_end= GETDATE(), status= 'completed' where trip_id = ?;

                """

        data= [trip_id]

        cursor.executemany(query,[data])

        cursor.commit()

        cursor.close()

        conn.close()

        body = {

            "statusCode": 200,

            "message": "Row updated", 

            "data": ""

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while updating trip. {e}",

            "data": ""

        } 

        

    return body



def get_trip_passengers(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "reporting"

        password = "H5ysh=ZDZtae~r{7B*Q8"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        driver_id = event.get('driver_id')

        conn = get_db_connection()

        query = f"""Select A.trip_id, B.employee_id, C.name, C.last_name, b.flaq as status from 

                    employee_app.trip_table A

                    join employee_app.reserve_table B

                    on A.trip_id=B.trip_id 

                    join employee_app.employee_table C

                    on B.employee_id=C.employee_id

                    where A.driver_id = {driver_id}

                    and b.flaq <> 'canceled'

                    and A.status= 'in progress';

                """

        df = pd.read_sql_query(query, conn, params=None)

        body = {

            "statusCode": 200,

            "message": "Passengers information successfully obtained", 

            "data": df.to_dict("records")

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting passengers. {e}",

            "data": ""

        } 

    return body 


def move_employee_between_trips(event, context):
    try:
        # Parse body from API Gateway event
        if isinstance(event.get('body'), str):
            body = json.loads(event['body'])
        else:
            body = event
        
        employee_ids = body.get('employee_ids', [])
        from_trip_id = body.get('from_trip_id')
        to_trip_id = body.get('to_trip_id')
        
        if not employee_ids or not from_trip_id or not to_trip_id:
            return {
                'statusCode': 400,
                'body': json.dumps({
                    'message': 'Missing required parameters: employee_ids, from_trip_id, to_trip_id'
                })
            }
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Update reserve_table to move employees to new trip
        for employee_id in employee_ids:
            update_query = """
            UPDATE employee_app.reserve_table 
            SET trip_id = ? 
            WHERE employee_id = ? AND trip_id = ?
            """
            cursor.execute(update_query, (to_trip_id, employee_id, from_trip_id))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'POST,OPTIONS'
            },
            'body': json.dumps({
                'message': f'Successfully transferred {len(employee_ids)} employee(s) from trip {from_trip_id} to trip {to_trip_id}'
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'message': f'Error transferring employees: {str(e)}'
            })
        }


def driver_update_position(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "scripting"

        password = "0O%9d22lF$mIre6dCWue"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        trip_id = event.get('trip_id')

        latitude = event.get('latitude')

        longitude = event.get('longitude')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        query = f"""

                    INSERT INTO employee_app.live_trip_position ([trip_id],[latitude],[longitude],[date])

                    VALUES (?,?,?,GETDATE())

                """

        data= [(trip_id, latitude, longitude)]

        cursor.executemany(query,data)

        cursor.commit()

        cursor.close()

        conn.close()

        body = {

            "statusCode": 200,

            "message": "Row inserted", 

            "data": ""

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting trip. {e}",

            "data": ""

        }      

    return body



def get_driver_update_position(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "reporting"

        password = "H5ysh=ZDZtae~r{7B*Q8"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        trip_id = event.get('trip_id')

        conn = get_db_connection()

        query = f"""select top 1 live_position_id, longitude,latitude from employee_app.live_trip_position 

                    where trip_id = {trip_id}

                    order by live_position_id desc

                """

        df = pd.read_sql_query(query, conn, params=None)

        body = {

            "statusCode": 200,

            "message": "Trip location information successfully obtained", 

            "data": df.to_dict("records")

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting employee. {e}",

            "data": ""

        } 

    return body



def get_user_information(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "reporting"

        password = "H5ysh=ZDZtae~r{7B*Q8"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        email = event.get('email')

        conn = get_db_connection()

        query = f"""

                    SELECT a.employee_id, a.name, a.last_name, a.phone_number, a.email from employee_app.employee_table as a where a.email = '{email}';

                """

        df = pd.read_sql_query(query, conn, params=None)

        body = {

            "statusCode": 200,

            "message": "Employee information successfully obtained", 

            "data": df.to_dict("records")

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting employee. {e}",

            "data": ""

        } 

    return body



def employee_get_countries(event, context):
    try:
        conn = get_db_connection()
        
        # Query the same table that production uses for countries
        query = """
            SELECT DISTINCT country 
            FROM employee_app.sites_table 
            WHERE country IS NOT NULL AND country != ''
            ORDER BY country
        """
        
        cursor = conn.cursor()
        cursor.execute(query)
        rows = cursor.fetchall()
        
        countries_data = []
        for row in rows:
            countries_data.append({
                "country": row[0]
            })
        
        return {
            "statusCode": 200,
            "message": "Countries were successfully obtained",
            "data": countries_data
        }
        
    except Exception as e:
        return {
            "statusCode": 400,
            "message": f"ERROR while getting countries: {e}",
            "data": []
        }


def get_driver_information(event, context):
    try:
        conn = get_db_connection()
        email = event.get('email')
        
        query = """
            SELECT d.driver_id, d.name, d.last_name, d.cell_phone, d.email, d.status 
            FROM employee_app.driver_table as d 
            WHERE d.email = ?
        """
        
        cursor = conn.cursor()
        cursor.execute(query, (email,))
        rows = cursor.fetchall()
        
        driver_data = []
        for row in rows:
            driver_data.append({
                "id": row[0],
                "name": row[1],
                "email": row[4],
                "enabled": row[5] == 'able'  # Map status to boolean
            })
        
        return {
            "statusCode": 200,
            "message": "Driver information successfully obtained",
            "data": driver_data
        }
        
    except Exception as e:
        return {
            "statusCode": 400,
            "message": f"ERROR while getting Driver. {e}",
            "data": ""
        }


def get_employee_info(event, context):
    try:
        conn = get_db_connection()
        email = event.get('email')
        
        query = """
            SELECT employee_id, name, last_name, phone_number, email, status, section_name 
            FROM employee_app.employee_table 
            WHERE email = ?
        """
        
        cursor = conn.cursor()
        cursor.execute(query, (email,))
        row = cursor.fetchone()
        
        if row:
            employee_data = {
                "employee_id": row[0],
                "name": row[1],
                "last_name": row[2],
                "phone_number": row[3],
                "email": row[4],
                "status": row[5],
                "section_name": row[6]
            }
            
            return {
                "statusCode": 200,
                "message": "Employee information successfully obtained",
                "data": [employee_data]  # Return as array like production
            }
        else:
            return {
                "statusCode": 404,
                "message": "Employee not found",
                "data": []
            }
            
    except Exception as e:
        return {
            "statusCode": 400,
            "message": f"ERROR while getting employee info: {e}",
            "data": []
        }



    try:

        hostname = "itel-db-server.database.windows.net"

        username = "reporting"

        password = "H5ysh=ZDZtae~r{7B*Q8"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        email = event.get('email')

        conn = get_db_connection()

        query = f"""

                    SELECT d.driver_id, d.name, d.last_name, d.cell_phone, d.email, d.status from employee_app.driver_table as d where d.email = '{email}';

                """

        df = pd.read_sql_query(query, conn, params=None)

        body = {

            "statusCode": 200,

            "message": "Driver information successfully obtained", 

            "data": df.to_dict("records")

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting Driver. {e}",

            "data": ""

        } 

    return body 



def employee_create_booking(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "scripting"

        password = "0O%9d22lF$mIre6dCWue"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        employee_id = event.get('employee_id')

        trip_id = event.get('trip_id')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        query = f"""

                    IF NOT EXISTS (select * from employee_app.reserve_table where employee_id={employee_id} and trip_id={trip_id})

                    INSERT INTO employee_app.reserve_table ([employee_id],[trip_id],[reservation_date],[flaq])

                    VALUES ({employee_id},{trip_id},cast(CONVERT(datetime, SWITCHOFFSET(SYSDATETIMEOFFSET(), DATEPART(TZOFFSET,SYSDATETIMEOFFSET() AT TIME ZONE 'Central Standard Time'))) as datetime),'pending')



                """

        cursor.execute(query)

        cursor.commit()

        cursor.close()

        conn.close()

        conn = get_db_connection()

        query = f"""

                    select A.*, B.route_name, B.route_description from 

                    employee_app.trip_table A

                    join employee_app.route_table B

                    on A.route_id=B.route_id

                    where A.trip_id = {trip_id};

                """

        df = pd.read_sql_query(query, conn, params=None)

        df["date_begin"] = df["date_begin"].astype(str)

        df["date_end"] = df["date_end"].astype(str)

        body = {

            "statusCode": 200,

            "message": "Employee information successfully obtained", 

            "data": df.to_dict("records")

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR creating booking. {e}",

            "data": ""

        }      

    return body



def employee_cancel_booking(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "scripting"

        password = "0O%9d22lF$mIre6dCWue"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        # Parse body if it's from API Gateway
        if 'body' in event and isinstance(event['body'], str):
            body_data = json.loads(event['body'])
            trip_id = body_data.get('trip_id')
            employee_id = body_data.get('employee_id')
        else:
            trip_id = event.get('trip_id')
            employee_id = event.get('employee_id')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        query = f"""

                    UPDATE employee_app.reserve_table set flaq= 'canceled' where trip_id = ? and employee_id = ?;

                """

        data= [(trip_id,employee_id)]

        cursor.executemany(query,data)

        cursor.commit()

        cursor.close()

        conn.close()

        body = {

            "statusCode": 200,

            "message": "Row updated", 

            "data": ""

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR canceling booking. {e}",

            "data": ""

        }      

    return body



def employee_get_routes_by_site(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "reporting"

        password = "H5ysh=ZDZtae~r{7B*Q8"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        conn = get_db_connection()

        site_id = event.get('site_id')

        query = f"""SELECT route_id, route_name FROM employee_app.route_table A

                        where site_id = '{site_id}';

                """

        print(query)

        df = pd.read_sql_query(query, conn, params=None)

        body = {

            "statusCode": 200,

            "message": "Routes were successfully obtained", 

            "data": df.to_dict("records")

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body


def employee_get_initial_data(event, context):
    """
    Combined endpoint to get countries, sites, and routes in one call
    Reduces cold starts from 3 separate Lambda calls to 1
    """
    try:
        conn = get_db_connection()
        
        # Parse body if it's from API Gateway
        if 'body' in event and isinstance(event['body'], str):
            body_data = json.loads(event['body'])
            country = body_data.get('country', 'St Lucia')  # Default to St Lucia
        else:
            country = event.get('country', 'St Lucia')
        
        # Get countries from sites_table
        countries_query = "SELECT DISTINCT country FROM employee_app.sites_table ORDER BY country"
        countries_df = pd.read_sql_query(countries_query, conn)
        countries = [{"country": row["country"]} for _, row in countries_df.iterrows()]
        
        # Get sites for the specified country
        sites_query = "SELECT site_id, site_name FROM employee_app.sites_table WHERE country = ? ORDER BY site_name"
        sites_df = pd.read_sql_query(sites_query, conn, params=[country])
        sites = sites_df.to_dict("records")
        
        # Get routes for the first site (assuming auto-select)
        routes = []
        if len(sites) > 0:
            site_id = sites[0]["site_id"]
            routes_query = "SELECT route_id, route_name FROM employee_app.route_table WHERE site_id = ? ORDER BY route_name"
            routes_df = pd.read_sql_query(routes_query, conn, params=[site_id])
            routes = routes_df.to_dict("records")
        
        conn.close()
        
        body = {
            "statusCode": 200,
            "message": "Initial data loaded successfully",
            "data": {
                "countries": countries,
                "sites": sites,
                "routes": routes,
                "selected_country": country,
                "selected_site": sites[0] if sites else None
            }
        }
    except Exception as e:
        print(f"Error in employee_get_initial_data: {str(e)}")
        body = {
            "statusCode": 400,
            "message": f"ERROR getting initial data: {e}",
            "data": {}
        }
    return body


def employee_get_stops_by_city(event, context):
    try:
        conn = get_db_connection()
        
        # Parse body if it's from API Gateway
        if 'body' in event and isinstance(event['body'], str):
            body_data = json.loads(event['body'])
            city = body_data.get('city')
        else:
            city = event.get('city')
        
        query = f"""SELECT id, community as stop_name, city, country 
                    FROM employee_app.route_alignment 
                    WHERE city = ? AND is_active = 1
                    ORDER BY community
                """
        
        df = pd.read_sql_query(query, conn, params=[city])
        
        body = {
            "statusCode": 200,
            "message": "Stops were successfully obtained", 
            "data": df.to_dict("records")
        }
    except Exception as e:
        print(f"Error in employee_get_stops_by_city: {str(e)}")
        body = {
            "statusCode": 400,
            "message": f"ERROR while getting stops: {e}",
            "data": []
        } 
    return body


def admin_add_trips(event, context):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Add trip for Itel SLU - Vieux Fort (route_id=10) for Dec 10, 2025
        cursor.execute("""
        INSERT INTO employee_app.trip_table (route_id, date_begin, date_end, status, driver_id, vehicle_id, recurrent_days)
        VALUES (10, '2025-12-10', '2025-12-10', 'pending', 0, 1, NULL)
        """)
        
        # Get the trip_id
        cursor.execute("SELECT @@IDENTITY")
        trip_id_1 = cursor.fetchone()[0]
        
        # Check for reverse route and add if exists
        cursor.execute("SELECT route_id, route_name FROM employee_app.route_table WHERE route_name LIKE 'Vieux Fort%Itel%'")
        reverse_route = cursor.fetchone()
        
        trips_added = [f"Trip {trip_id_1}: Itel SLU - Vieux Fort"]
        
        if reverse_route:
            cursor.execute("""
            INSERT INTO employee_app.trip_table (route_id, date_begin, date_end, status, driver_id, vehicle_id, recurrent_days)
            VALUES (?, '2025-12-10', '2025-12-10', 'pending', 0, 1, NULL)
            """, (reverse_route[0],))
            
            cursor.execute("SELECT @@IDENTITY")
            trip_id_2 = cursor.fetchone()[0]
            trips_added.append(f"Trip {trip_id_2}: {reverse_route[1]}")
        
        conn.commit()
        cursor.close()
        conn.close()
        
        body = {
            "statusCode": 200,
            "message": f"Added {len(trips_added)} trips for 2025-12-10",
            "data": {"trips": trips_added}
        }
    except Exception as e:
        body = {
            "statusCode": 400,
            "message": f"ERROR adding trips: {e}",
            "data": {}
        }
    return body


def admin_clear_bookings(event, context):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # First get count
        cursor.execute("SELECT COUNT(*) FROM employee_app.reserve_table")
        count = cursor.fetchone()[0]
        
        # Delete all bookings
        cursor.execute("DELETE FROM employee_app.reserve_table")
        conn.commit()
        
        cursor.close()
        conn.close()
        
        body = {
            "statusCode": 200,
            "message": f"Deleted {count} bookings",
            "data": {"deleted_count": count}
        }
    except Exception as e:
        body = {
            "statusCode": 400,
            "message": f"ERROR clearing bookings: {e}",
            "data": {}
        }
    return body



def employee_get_trip_by_route_date(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "reporting"

        password = "H5ysh=ZDZtae~r{7B*Q8"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        conn = get_db_connection()

        route_id = event.get('route_id')

        date = event.get('date')

        query = f""" SELECT A.trip_id, B.route_name, B.route_description, C.country, A.date_begin FROM employee_app.trip_table A

                        join employee_app.route_table B

                        on A.route_id = B.route_id

                        join employee_app.sites_table C

                        on B.site_id = C.site_id

                        where A.route_id = {route_id}

                        and CAST(A.date_begin AS date) = '{date}'

                        and A.status in ('pending','in progress');

                        

                """

        df = pd.read_sql_query(query, conn, params=None)

        df["date_begin"] = df["date_begin"].astype(str)

        body = {

            "statusCode": 200,

            "message": "Today's trips were successfully obtained", 

            "data": df.to_dict("records")

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body





#=============

def driver_get_previous_trips(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "reporting"

        password = "H5ysh=ZDZtae~r{7B*Q8"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        conn = get_db_connection()

        driver_id = event.get('driver_id')

        page_size = event.get('page_size')

        page_number = event.get('page_number')

        ##

        query_1 = f"""SELECT

                        trt.trip_id as trip_id,

                        trt.date_begin as date_begin,

                        trt.date_end as date_end,

                        rt.route_name as route_name,

                        rt.route_description as description

                    FROM employee_app.trip_table as trt

                    INNER JOIN employee_app.route_table as rt on rt.route_id = trt.route_id

                    WHERE trt.driver_id = {driver_id} AND trt.status = 'completed'

                    ORDER BY trt.date_begin DESC

                """

        total_rows = len(pd.read_sql_query(query_1, conn, params=None))

        total_pages = math.ceil(total_rows/page_size)

        query_2 = f"""SELECT

                        trt.trip_id as trip_id,

                        trt.date_begin as date_begin,

                        trt.date_end as date_end,

                        rt.route_name as route_name,

                        rt.route_description as description

                    FROM employee_app.trip_table as trt

                    INNER JOIN employee_app.route_table as rt on rt.route_id = trt.route_id

                    WHERE trt.driver_id = {driver_id} AND trt.status = 'completed'

                    ORDER BY trt.date_begin DESC

                    OFFSET {page_size*(page_number-1)} ROWS

                    FETCH NEXT {page_size} ROWS ONLY;

                """

        df = pd.read_sql_query(query_2, conn, params=None)

        df["date_begin"] = df["date_begin"].astype(str)

        df["date_end"] = df["date_end"].astype(str)

        body = {

            "statusCode": 200,

            "message": "Previous trips for driver were successfully obtained", 

            "total_pages": total_pages,

            "data": df.to_dict("records")

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info.",

            "data": ""

        } 

    return body

    



def driver_get_future_trips(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "reporting"

        password = "H5ysh=ZDZtae~r{7B*Q8"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        conn = get_db_connection()

        driver_id = event.get('driver_id')

        page_size = event.get('page_size')

        page_number = event.get('page_number')

        ##

        query_1 = f"""SELECT

                        trt.trip_id as trip_id,

                        trt.date_begin as date_begin,

                        rt.route_name as route_name,

                        rt.route_description as description

                    FROM employee_app.trip_table as trt

                    INNER JOIN employee_app.route_table as rt on rt.route_id = trt.route_id

                    WHERE trt.driver_id = {driver_id} AND trt.status = 'pending'

                    ORDER BY trt.date_begin DESC

                """

        total_rows = len(pd.read_sql_query(query_1, conn, params=None))

        total_pages = math.ceil(total_rows/page_size)

        query_2 = f"""SELECT

                        trt.trip_id as trip_id,

                        trt.date_begin as date_begin,

                        rt.route_name as route_name,

                        rt.route_description as description

                    FROM employee_app.trip_table as trt

                    INNER JOIN employee_app.route_table as rt on rt.route_id = trt.route_id

                    WHERE trt.driver_id = {driver_id} AND trt.status = 'pending'

                    ORDER BY trt.date_begin DESC

                    OFFSET {page_size*(page_number-1)} ROWS

                    FETCH NEXT {page_size} ROWS ONLY;

                """

        df = pd.read_sql_query(query_2, conn, params=None)

        df["date_begin"] = df["date_begin"].astype(str)

        body = {

            "statusCode": 200,

            "message": "Previous trips for driver were successfully obtained", 

            "total_pages": total_pages,

            "data": df.to_dict("records")

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info.",

            "data": ""

        } 

    return body



def employee_get_current_trip(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "reporting"

        password = "H5ysh=ZDZtae~r{7B*Q8"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        conn = get_db_connection()

        hrm_id = event.get('hrm_id')

        query = f"""select C.route_name, C.route_description, B.status, A.trip_id, B.date_begin, C.start_point, C.end_point_point, a.flaq as reserve_status from employee_app.reserve_table A

                        join employee_app.trip_table B

                        on A.trip_id=B.trip_id

                        join employee_app.route_table C

                        on B.route_id=C.route_id

                        where A.employee_id = {hrm_id} 

                        and B.status = 'in progress'

                        and a.flaq in ('pending','completed');

                """

        df = pd.read_sql_query(query, conn, params=None)

        df["date_begin"] = df["date_begin"].astype(str)

        body = {

            "statusCode": 200,

            "message": "Today's trip were successfully obtained", 

            "data": df.to_dict("records")

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def employee_get_prev_bookings(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "reporting"

        password = "H5ysh=ZDZtae~r{7B*Q8"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        conn = get_db_connection()

        hrm_id = event.get('hrm_id')

        page_size = event.get('page_size')

        page_number = event.get('page_number')

        ##

        query_1 = f"""select C.route_name, A.trip_id, B.date_begin from employee_app.reserve_table A

                        join employee_app.trip_table B

                        on A.trip_id=B.trip_id

                        join employee_app.route_table C

                        on B.route_id=C.route_id

                        where A.employee_id = {hrm_id} 

                        and A.flaq = 'completed'

                        ORDER BY B.date_begin DESC

                """

        total_rows = len(pd.read_sql_query(query_1, conn, params=None))

        total_pages = math.ceil(total_rows/page_size)

        query_2 = f"""select C.route_name, A.trip_id, B.date_begin from employee_app.reserve_table A

                        join employee_app.trip_table B

                        on A.trip_id=B.trip_id

                        join employee_app.route_table C

                        on B.route_id=C.route_id

                        where A.employee_id = {hrm_id} 

                        and A.flaq = 'completed'

                    ORDER BY B.date_begin DESC

                    OFFSET {page_size*(page_number-1)} ROWS

                    FETCH NEXT {page_size} ROWS ONLY;

                """

        df = pd.read_sql_query(query_2, conn, params=None)

        df["date_begin"] = df["date_begin"].astype(str)

        body = {

            "statusCode": 200,

            "message": "Previous employee's reserves were successfully obtained", 

            "total_pages": total_pages,

            "data": df.to_dict("records")

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info.",

            "data": ""

        } 

    return body



def employee_get_future_bookings(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "reporting"

        password = "H5ysh=ZDZtae~r{7B*Q8"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        conn = get_db_connection()

        hrm_id = event.get('hrm_id')

        page_size = event.get('page_size')

        page_number = event.get('page_number')

        ##

        query_1 = f"""select C.route_name, A.trip_id, B.date_begin from employee_app.reserve_table A

                        join employee_app.trip_table B

                        on A.trip_id=B.trip_id

                        join employee_app.route_table C

                        on B.route_id=C.route_id

                        where A.employee_id = {hrm_id} 

                        and A.flaq = 'pending'

                        ORDER BY B.date_begin DESC

                """

        total_rows = len(pd.read_sql_query(query_1, conn, params=None))

        total_pages = math.ceil(total_rows/page_size)

        query_2 = f"""select C.route_name, A.trip_id, B.date_begin from employee_app.reserve_table A

                        join employee_app.trip_table B

                        on A.trip_id=B.trip_id

                        join employee_app.route_table C

                        on B.route_id=C.route_id

                        where A.employee_id = {hrm_id} 

                        and A.flaq = 'pending'

                    ORDER BY B.date_begin DESC

                    OFFSET {page_size*(page_number-1)} ROWS

                    FETCH NEXT {page_size} ROWS ONLY;

                """

        df = pd.read_sql_query(query_2, conn, params=None)

        df["date_begin"] = df["date_begin"].astype(str)

        body = {

            "statusCode": 200,

            "message": "Future employee's reserves were successfully obtained", 

            "total_pages": total_pages,

            "data": df.to_dict("records")

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info.",

            "data": ""

        } 

    return body



def driver_get_trip_info(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "reporting"

        password = "H5ysh=ZDZtae~r{7B*Q8"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        conn = get_db_connection()

        trip_id = event.get('trip_id')

        query = f"""select A.status, B.route_id, B.route_description, B.route_name, A.date_begin, A.date_end, B.start_point,B.end_point_point,D.capacity,

                    ISNULL(count(distinct (case when C.flaq='pending' then C.reserve_id end)),0) as reserves_count,

                    ISNULL(count(distinct (case when C.flaq='completed' then C.reserve_id end)),0) as passengers_count

                    from employee_app.trip_table A

                    join employee_app.route_table B

                    on A.route_id=B.route_id 

                    LEFT join employee_app.reserve_table C

                    on A.trip_id=C.trip_id

					join employee_app.vehicle_table D

					on A.vehicle_id= D.vehicle_id

					where A.trip_id = {trip_id}

                    group by A.status, B.route_id, B.route_description, B.route_name, A.date_begin, A.date_end,  B.start_point,B.end_point_point,D.capacity;

                """

        df = pd.read_sql_query(query, conn, params=None)

        df["date_begin"] = df["date_begin"].astype(str)

        df["date_end"] = df["date_end"].astype(str)

        body = {

            "statusCode": 200,

            "message": "Trip was successfully obtained", 

            "data": df.to_dict("records")

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def call_emergency(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "scripting"

        password = "0O%9d22lF$mIre6dCWue"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        trip_id = event.get('trip_id')

        emergency_id = event.get('emergency_id')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        query = f"""

                    INSERT INTO employee_app.emergency_register_table ([trip_id], emergency_id, [date],[state])

                    VALUES (?, ?, GETDATE(), 'pending')

                """

        data= [(trip_id, emergency_id)]

        cursor.executemany(query,data)

        cursor.commit()

        cursor.close()

        conn.close()

        body = {

            "statusCode": 200,

            "message": "Row inserted", 

            "data": ""

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while writting emergency. {e}",

            "data": ""

        }      

    return body



def get_code_emergency(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "reporting"

        password = "H5ysh=ZDZtae~r{7B*Q8"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        conn = get_db_connection()

        trip_id = event.get('trip_id')

        query = f"""select * from (select st.country from employee_app.trip_table t

                    left join employee_app.route_table rt 

                    on t.route_id = rt.route_id

                    left join employee_app.sites_table st 

                    on rt.site_id = st.site_id

                    where t.trip_id = {trip_id} ) as c

                    inner join employee_app.country_code_emergency cce

                    on cce.country = c.country

                    left join employee_app.call_emergency ce 

                    on cce.emergency_id = ce.emergency_id;

                """

        print(query)

        df = pd.read_sql_query(query, conn, params=None)

        body = {

            "statusCode": 200,

            "message": "Today's trips were successfully obtained", 

            "data": df.to_dict("records")

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def employee_get_countries(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "reporting"

        password = "H5ysh=ZDZtae~r{7B*Q8"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        conn = get_db_connection()

        query = f"""select distinct(country) from employee_app.sites_table;	

                """

        print(query)

        df = pd.read_sql_query(query, conn, params=None)

        body = {

            "statusCode": 200,

            "message": "Countries were successfully obtained", 

            "data": df.to_dict("records")

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def employee_get_sites(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "reporting"

        password = "H5ysh=ZDZtae~r{7B*Q8"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        conn = get_db_connection()

        country = event.get('country')

        query = f"""select site_id, site_name from employee_app.sites_table

                    where country = '{country}';

                """

        print(query)

        df = pd.read_sql_query(query, conn, params=None)

        body = {

            "statusCode": 200,

            "message": "Sites were successfully obtained", 

            "data": df.to_dict("records")

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def employee_get_sites(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "reporting"

        password = "H5ysh=ZDZtae~r{7B*Q8"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        conn = get_db_connection()

        country = event.get('country')

        query = f"""select site_id, site_name from employee_app.sites_table

                    where country = '{country}';

                """

        print(query)

        df = pd.read_sql_query(query, conn, params=None)

        body = {

            "statusCode": 200,

            "message": "Sites were successfully obtained", 

            "data": df.to_dict("records")

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def employee_get_info(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "reporting"

        password = "H5ysh=ZDZtae~r{7B*Q8"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        conn = get_db_connection()

        email = event.get('email')

        if "'" in email: 

            email = email.replace("'", "''")

            query = f"""select * from employee_app.employee_table

                    where email = '{email}';

                """

        else:

            query = f"""select * from employee_app.employee_table

                    where email = '{email}';

                    """

        

        print(query)

        df = pd.read_sql_query(query, conn, params=None)

        body = {

            "statusCode": 200,

            "message": "Sites were successfully obtained", 

            "data": df.to_dict("records")

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def employee_get_trip_info(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "reporting"

        password = "H5ysh=ZDZtae~r{7B*Q8"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        conn = get_db_connection()

        trip_id = event.get('trip_id')

        employee_id = event.get('employee_id')

        query = f"""select A.status, B.route_id, B.route_description, B.route_name, A.date_begin, A.date_end, B.start_point,B.end_point_point,

					ISNULL(count(distinct (case when C.flaq='pending' then C.reserve_id end)),0) as reserves_count,

                    ISNULL(count(distinct (case when C.flaq='completed' then C.reserve_id end)),0) as passengers_count

                    from employee_app.trip_table A

                    join employee_app.route_table B

                    on A.route_id=B.route_id 

                    left join employee_app.reserve_table C

                    on A.trip_id=C.trip_id

					where A.trip_id = {trip_id}

					group by A.status, B.route_id, B.route_description, B.route_name, A.date_begin, A.date_end,  B.start_point,B.end_point_point;



                """

        df = pd.read_sql_query(query, conn, params=None)

        df["date_begin"] = df["date_begin"].astype(str)

        df["date_end"] = df["date_end"].astype(str)

        route_id= df["route_id"][0]

        date_begin= df["date_begin"][0]

        date_begin=date_begin[0:10]

        #print(date_begin)

        data = df.to_dict("records")[0]

        query2 = f"""if exists(select top 1 flaq as reserve_status from employee_app.reserve_table where employee_id ={employee_id} and trip_id= {trip_id} order by reserve_id desc)

                    select top 1 flaq as reserve_status from employee_app.reserve_table where employee_id ={employee_id} and trip_id= {trip_id} order by reserve_id desc

                    else

                    select null as reserve_status;

                """

        df2 = pd.read_sql_query(query2, conn, params=None)

        data["reserve_status"] = df2["reserve_status"][0]

        query3 = f"""if exists (select 'TRUE' as have_another_booking from employee_app.reserve_table a join employee_app.trip_table b on a.trip_id=b.trip_id where a.employee_id ={employee_id} and b.route_id={route_id} and a.flaq='pending' and CONVERT(VARCHAR(25), b.date_begin , 126) LIKE '{date_begin}%') 

					select 'TRUE' as have_another_booking from employee_app.reserve_table a join employee_app.trip_table b on a.trip_id=b.trip_id where a.employee_id ={employee_id} and b.route_id={route_id} and a.flaq='pending' and CONVERT(VARCHAR(25), b.date_begin , 126) LIKE '{date_begin}%'

                    else

                    select 'FALSE' as have_another_booking;

                """

        df3 = pd.read_sql_query(query3, conn, params=None)

        data["have_another_booking"] = df3["have_another_booking"][0]

        body = {

            "statusCode": 200,

            "message": "Trip was successfully obtained", 

            "data": data

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def delete_employee_info(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "scripting"

        password = "0O%9d22lF$mIre6dCWue"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        employee_id = event.get('employee_id')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        query = f"""

                    UPDATE employee_app.employee_table set status= 'disable' where employee_id = ?;

                """

        data= [employee_id]

        cursor.executemany(query,[data])

        cursor.commit()

        cursor.close()

        conn.close()

        body = {

            "statusCode": 200,

            "message": "Your user was deleted succesfully", 

            "data": ""

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def delete_driver_info(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "scripting"

        password = "0O%9d22lF$mIre6dCWue"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        driver_id = event.get('driver_id')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        query = f"""

                    UPDATE employee_app.driver_table set status= 'disable' where driver_id = ?;

                """

        data= [driver_id]

        cursor.executemany(query,[data])

        cursor.commit()

        cursor.close()

        conn.close()

        body = {

            "statusCode": 200,

            "message": "Your user was deleted succesfully",

            "data": ""

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def create_employee(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "scripting"

        password = "0O%9d22lF$mIre6dCWue"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        name = event.get('name')

        last_name = event.get('last_name')

        phone_number = event.get('phone_number')

        email = event.get('email')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        query = f"""

                    INSERT INTO employee_app.employee_table ([name], [last_name], [phone_number], [email], [status])

                    VALUES (?, ?, ?, ?,'able')

                """

        data= [(name, last_name, phone_number, email)]

        cursor.executemany(query,data)

        cursor.commit()

        cursor.close()

        conn.close()

        body = {

            "statusCode": 200,

            "message": "Row inserted", 

            "data": ""

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while writting emergency. {e}",

            "data": ""

        }      

    return body



def create_driver(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "scripting"

        password = "0O%9d22lF$mIre6dCWue"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        name = event.get('name')

        last_name = event.get('last_name')

        cell_phone = event.get('cell_phone')

        email = event.get('email')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        query = f"""

                    INSERT INTO employee_app.driver_table ([name], [last_name], [cell_phone], [email], [status])

                    VALUES (?, ?, ?, ?,'able')

                """

        data= [(name, last_name, cell_phone, email)]

        cursor.executemany(query,data)

        cursor.commit()

        cursor.close()

        conn.close()

        body = {

            "statusCode": 200,

            "message": "Row inserted", 

            "data": ""

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while writting emergency. {e}",

            "data": ""

        }      

    return body



def admin_get_users_count(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "reporting"

        password = "H5ysh=ZDZtae~r{7B*Q8"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        conn = get_db_connection()

        query = f"""select count(*) as number_admins from employee_app.admin_user_table

                """

        df = pd.read_sql_query(query, conn, params=None)

        data = df.to_dict("records")[0]

        query2 = f"""select count(*) as number_drivers from employee_app.driver_table

                    where status = 'able'

                """

        df2 = pd.read_sql_query(query2, conn, params=None)

        query3 = f"""select count(*) as number_employees from employee_app.employee_table

                """

        df3 = pd.read_sql_query(query3, conn, params=None)

        data["number_drivers"] = df2["number_drivers"][0]

        data["number_employees"] = df3["number_employees"][0]

        body = {

            "statusCode": 200,

            "message": "Insights were succesfully obtained", 

            "data": str(data)

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def admin_get_sites(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "reporting"

        password = "H5ysh=ZDZtae~r{7B*Q8"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        conn = get_db_connection()

        query = f"""select site_id, site_name, country from employee_app.sites_table;

                """

        print(query)

        df = pd.read_sql_query(query, conn, params=None)

        body = {

            "statusCode": 200,

            "message": "Sites were successfully obtained", 

            "data": df.to_dict("records")

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def admin_get_routes(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "reporting"

        password = "H5ysh=ZDZtae~r{7B*Q8"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        conn = get_db_connection()

        items_per_page = event.get('items_per_page')

        page = event.get('page')

        search_word = event.get('search_word')

        ##

        query_1 = f"""SELECT route_id, route_name, route_description, a.start_point, a.end_point_point, a.site_id, b.site_name, b.city, b.country

                        FROM employee_app.route_table a

						join employee_app.sites_table b

						on a.site_id=b.site_id

                        where route_name like '%{search_word}%'

                        or route_description like '%{search_word}%'

                        or b.site_name like '%{search_word}%'

                        ORDER BY route_id ASC

                """

        total_rows = len(pd.read_sql_query(query_1, conn, params=None))

        total_pages = math.ceil(total_rows/items_per_page)

        query_2 = f"""SELECT route_id, route_name, route_description, a.start_point, a.end_point_point, a.site_id, b.site_name, b.city, b.country

                        FROM employee_app.route_table a

						join employee_app.sites_table b

						on a.site_id=b.site_id

                        where route_name like '%{search_word}%'

                        or route_description like '%{search_word}%'

                        or b.site_name like '%{search_word}%'

                        ORDER BY route_id ASC

                    OFFSET {items_per_page*(page-1)} ROWS

                    FETCH NEXT {items_per_page} ROWS ONLY;

                """

        df = pd.read_sql_query(query_2, conn, params=None)

        body = {

            "statusCode": 200,

            "message": "Routes were successfully obtained", 

            "total_pages": total_pages,

            "total_rows": total_rows,

            "data": df.to_dict("records")

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def admin_get_trips(event, context):
    try:
        conn = get_db_connection()

        items_per_page = event.get('items_per_page')
        page = event.get('page')
        search_word = event.get('search_word')
        
        # Add filter parameters
        status_filter = event.get('status_filter', '')
        driver_filter = event.get('driver_filter', '')
        route_filter = event.get('route_filter', '')
        
        order_by_key_name = event.get('order_by_key_name') or 'trip_id'
        order_by_is_desc = event.get('order_by_is_desc')
        if order_by_is_desc is None:
            order_by_is_desc = True
        order_direction = 'DESC' if order_by_is_desc else 'ASC'
        
        # Ensure safe column names to prevent SQL injection
        valid_columns = ['trip_id', 'date_begin', 'date_end', 'status', 'driver_id', 'route_id']
        if order_by_key_name not in valid_columns:
            order_by_key_name = 'trip_id'

        # Build WHERE clause for search and filters
        where_conditions = []
        
        if search_word:
            where_conditions.append(f"""(route_name like '%{search_word}%'
                        or d.route_description like '%{search_word}%'
                        or CONCAT(b.name,' ', b.last_name) like '%{search_word}%'
                        or b.name like '%{search_word}%'
                        or a.status like '%{search_word}%'
                        or CONVERT(VARCHAR(40), a.date_begin, 121) LIKE '%{search_word}%'
                        or CONVERT(VARCHAR(40), a.date_end, 121) LIKE '%{search_word}%')""")
        
        if status_filter:
            where_conditions.append(f"a.status = '{status_filter}'")
            
        if route_filter:
            where_conditions.append(f"route_name = '{route_filter}'")
        
        where_clause = ""
        if where_conditions:
            where_clause = "WHERE " + " AND ".join(where_conditions)

        query_1 = f"""SELECT a.trip_id, a.date_begin, a.date_end, a.status, b.driver_id, CONCAT(b.name,' ', b.last_name) as driver_name, c.vehicle_id, 
		c.licence_plate_number, c.capacity, d.route_id, route_name, d.route_description,
		ISNULL(count(distinct (case when e.flaq='completed' then e.reserve_id end)),0) as passengers_count,
		ISNULL(count(distinct (case when e.flaq='pending' then e.reserve_id end)),0) as reserves_pending_count
                        FROM employee_app.trip_table a 
						JOIN employee_app.driver_table b
						on a.driver_id = b.driver_id
						JOIN employee_app.vehicle_table c
						on a.vehicle_id = c.vehicle_id 
						JOIN employee_app.route_table d
						on a.route_id = d.route_id
						LEFT join employee_app.reserve_table e
						on a.trip_id=e.trip_id
                        {where_clause}
						GROUP BY a.trip_id, a.date_begin, a.date_end, a.status, b.driver_id, b.name, b.last_name, c.vehicle_id,c.licence_plate_number, c.capacity, d.route_id, route_name, d.route_description
                """

        total_rows = len(pd.read_sql_query(query_1, conn, params=None))
        total_pages = math.ceil(total_rows/items_per_page)

        query_2 = f"""SELECT a.trip_id, a.date_begin, a.date_end, a.status, b.driver_id, CONCAT(b.name,' ', b.last_name) as driver_name, c.vehicle_id, 
		c.licence_plate_number, c.capacity, d.route_id, route_name, d.route_description,
		ISNULL(count(distinct (case when e.flaq='completed' then e.reserve_id end)),0) as passengers_count,
		ISNULL(count(distinct (case when e.flaq='pending' then e.reserve_id end)),0) as reserves_pending_count
                    FROM employee_app.trip_table a 
                    JOIN employee_app.driver_table b
                    on a.driver_id = b.driver_id
                    JOIN employee_app.vehicle_table c
                    on a.vehicle_id = c.vehicle_id 
                    JOIN employee_app.route_table d
                    on a.route_id = d.route_id
                    LEFT join employee_app.reserve_table e
                    on a.trip_id=e.trip_id
                    {where_clause}
					GROUP BY a.trip_id, a.date_begin, a.date_end, a.status, b.driver_id, b.name, b.last_name, c.vehicle_id,c.licence_plate_number, c.capacity, d.route_id, route_name, d.route_description
                    ORDER BY {order_by_key_name} {order_direction}
                    OFFSET {items_per_page*(page-1)} ROWS
                    FETCH NEXT {items_per_page} ROWS ONLY;
                """

        df = pd.read_sql_query(query_2, conn, params=None)
        df.fillna(value='NULL', inplace=True)
        df["date_begin"] = df["date_begin"].astype(str)
        df["date_end"] = df["date_end"].astype(str)

        # Get filter options
        statuses_query = "SELECT DISTINCT status FROM employee_app.trip_table WHERE status IS NOT NULL ORDER BY status"
        drivers_query = """SELECT DISTINCT CONCAT(b.name,' ', b.last_name) as driver_name 
                          FROM employee_app.trip_table a 
                          JOIN employee_app.driver_table b ON a.driver_id = b.driver_id 
                          WHERE CONCAT(b.name,' ', b.last_name) IS NOT NULL 
                          ORDER BY driver_name"""
        routes_query = """SELECT DISTINCT route_name 
                         FROM employee_app.trip_table a 
                         JOIN employee_app.route_table d ON a.route_id = d.route_id 
                         WHERE route_name IS NOT NULL 
                         ORDER BY route_name"""

        statuses_df = pd.read_sql_query(statuses_query, conn)
        drivers_df = pd.read_sql_query(drivers_query, conn)
        routes_df = pd.read_sql_query(routes_query, conn)

        statuses = statuses_df['status'].tolist()
        drivers = drivers_df['driver_name'].tolist()
        routes = routes_df['route_name'].tolist()

        body = {
            "statusCode": 200,
            "message": "Trips were successfully obtained", 
            "total_pages": total_pages,
            "total_rows": total_rows,
            "data": df.to_dict("records"),
            "statuses": statuses,
            "drivers": drivers,
            "routes": routes
        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def admin_get_all_dashboard_users(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "reporting"

        password = "H5ysh=ZDZtae~r{7B*Q8"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        conn = get_db_connection()

        items_per_page = event.get('items_per_page')

        page = event.get('page')

        search_word = event.get('search_word')

        query_1 = f"""select user_id, CONCAT(name,' ', last_name) as name,phone_number, email, status from employee_app.admin_user_table

                      where (CONCAT(name,' ', last_name) like '%{search_word}%'

                      or email like '%{search_word}%'

                      or phone_number like '%{search_word}%')

                      ORDER BY user_id ASC

                """

        total_rows = len(pd.read_sql_query(query_1, conn, params=None))

        total_pages = 0

        if total_rows != 0:

            total_pages = math.ceil(total_rows/items_per_page)

            query_2 = f"""select user_id, CONCAT(name,' ', last_name) as name,phone_number, email, status from employee_app.admin_user_table

                        where (CONCAT(name,' ', last_name) like '%{search_word}%'

                        or email like '%{search_word}%'

                        or phone_number like '%{search_word}%')

                        ORDER BY user_id ASC

                        OFFSET {items_per_page*(page-1)} ROWS

                        FETCH NEXT {items_per_page} ROWS ONLY;

                    """

            df = pd.read_sql_query(query_2, conn, params=None)

            response = df.to_dict("records")

        else:

            response = []

        body = {

            "statusCode": 200,

            "message": "Users were successfully obtained", 

            "total_pages": total_pages,

            "total_rows": total_rows,

            "data": response

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def admin_get_trips_count(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "reporting"

        password = "H5ysh=ZDZtae~r{7B*Q8"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        conn = get_db_connection()

        query = f"""select count(*) as trips_count from employee_app.trip_table

                """

        df = pd.read_sql_query(query, conn, params=None)

        data = df.to_dict("records")[0]

        query2 = f"""select count(*) as routes_count from employee_app.route_table

                """

        df2 = pd.read_sql_query(query2, conn, params=None)

        query3 = f"""select count(*) as vehicles_count from employee_app.vehicle_table

                """

        df3 = pd.read_sql_query(query3, conn, params=None)

        query4 = f"""select count(*) as sites_count from employee_app.sites_table

                """

        df4 = pd.read_sql_query(query4, conn, params=None)

        data["routes_count"] = df2["routes_count"][0]

        data["vehicles_count"] = df3["vehicles_count"][0]

        data["sites_count"] = df4["sites_count"][0]

        body = {

            "statusCode": 200,

            "message": "Insights were succesfully obtained", 

            "data": str(data)

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def admin_search_trips(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "reporting"

        password = "H5ysh=ZDZtae~r{7B*Q8"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        conn = get_db_connection()

        site_id = event.get('site_id')

        page_size = event.get('page_size')

        page_number = event.get('page_number')

        search_word = event.get('search_word')

        ##

        query_1 = f"""SELECT a.trip_id, a.date_begin, a.date_end, a.status, b.driver_id, CONCAT(b.name,' ', b.last_name) as driver_name, c.vehicle_id, 

		c.licence_plate_number, c.capacity, d.route_id, route_name, d.route_description,

		ISNULL(count(distinct (case when e.flaq='completed' then e.reserve_id end)),0) as passengers_count,

		ISNULL(count(distinct (case when e.flaq='pending' then e.reserve_id end)),0) as reserves_pending_count

                        FROM employee_app.trip_table a 

						JOIN employee_app.driver_table b

						on a.driver_id = b.driver_id

						JOIN employee_app.vehicle_table c

						on a.vehicle_id = c.vehicle_id 

						JOIN employee_app.route_table d

						on a.route_id = d.route_id

						LEFT join employee_app.reserve_table e

						on a.trip_id=e.trip_id

						WHERE d.site_id = {site_id}

						GROUP BY a.trip_id, a.date_begin, a.date_end, a.status, b.driver_id, b.name, b.last_name, c.vehicle_id,c.licence_plate_number, c.capacity, d.route_id, route_name, d.route_description

                        ORDER BY trip_id asc;

                """

        total_rows = len(pd.read_sql_query(query_1, conn, params=None))

        total_pages = math.ceil(total_rows/page_size)

        query_2 = f"""SELECT a.trip_id, a.date_begin, a.date_end, a.status, b.driver_id, CONCAT(b.name,' ', b.last_name) as driver_name, c.vehicle_id, 

		c.licence_plate_number, c.capacity, d.route_id, route_name, d.route_description,

		ISNULL(count(distinct (case when e.flaq='completed' then e.reserve_id end)),0) as passengers_count,

		ISNULL(count(distinct (case when e.flaq='pending' then e.reserve_id end)),0) as reserves_pending_count

                    FROM employee_app.trip_table a 

                    JOIN employee_app.driver_table b

                    on a.driver_id = b.driver_id

                    JOIN employee_app.vehicle_table c

                    on a.vehicle_id = c.vehicle_id 

                    JOIN employee_app.route_table d

                    on a.route_id = d.route_id

                    LEFT join employee_app.reserve_table e

                    on a.trip_id=e.trip_id

                    WHERE d.site_id = {site_id}

                    GROUP BY a.trip_id, a.date_begin, a.date_end, a.status, b.driver_id, b.name, b.last_name, c.vehicle_id,c.licence_plate_number, c.capacity, d.route_id, route_name, d.route_description

                    ORDER BY trip_id asc

                    OFFSET {page_size*(page_number-1)} ROWS

                    FETCH NEXT {page_size} ROWS ONLY;

                """

        df = pd.read_sql_query(query_2, conn, params=None)

        df["date_begin"] = df["date_begin"].astype(str)

        df["date_end"] = df["date_end"].astype(str)

        body = {

            "statusCode": 200,

            "message": "Trips were successfully obtained", 

            "total_pages": total_pages,

            "total_rows": total_rows,

            "data": df.to_dict("records")

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def admin_get_all_drivers(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "reporting"

        password = "H5ysh=ZDZtae~r{7B*Q8"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        conn = get_db_connection()

        items_per_page = event.get('items_per_page')

        page = event.get('page')

        search_word = event.get('search_word')

        query_1 = f"""select driver_id, CONCAT(name, ' ', last_name) as name, cell_phone, email, status from employee_app.driver_table

                        where status <> 'disable'

                        and (CONCAT(name, ' ', last_name) like '%{search_word}%'

                        or name like '%{search_word}%'

                        or email like '%{search_word}%'

                        or cell_phone like '%{search_word}%')

                        ORDER BY driver_id ASC

                """

        total_rows = len(pd.read_sql_query(query_1, conn, params=None))

        total_pages = 0

        if total_rows != 0:

            total_pages = math.ceil(total_rows/items_per_page)

            query_2 = f"""select driver_id, CONCAT(name, ' ', last_name) as name, cell_phone, email, status from employee_app.driver_table

                            where status <> 'disable'

                            and (CONCAT(name, ' ', last_name) like '%{search_word}%'

                            or name like '%{search_word}%'

                            or email like '%{search_word}%'

                            or cell_phone like '%{search_word}%')

                            ORDER BY driver_id ASC

                            OFFSET {items_per_page*(page-1)} ROWS

                            FETCH NEXT {items_per_page} ROWS ONLY;

                    """

            df = pd.read_sql_query(query_2, conn, params=None)

            response = df.to_dict("records")

        else:

            response = []

        body = {

            "statusCode": 200,

            "message": "Drivers were successfully obtained", 

            "total_pages": total_pages,

            "total_rows": total_rows,

            "data": response

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def get_employee_login_validation(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "reporting"

        password = "H5ysh=ZDZtae~r{7B*Q8"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        conn = get_db_connection()

        employee_id = event.get('employee_id')

        query = f"""select status 

                    from employee_app.employee_table as e

                    where e.employee_id = {employee_id}

                """

        df = pd.read_sql_query(query, conn, params=None)

        validation = 1 if df["status"][0] == "able" else 0 

        body = {

            "statusCode": 200,

            "message": "user's validation executed succesfully", 

            "data": validation

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def admin_add_driver(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "scripting"

        password = "0O%9d22lF$mIre6dCWue"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        name = event.get('name')

        last_name = event.get('last_name')

        cell_phone = event.get('cell_phone')

        email = event.get('email')

        status = event.get('status')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        query = f"""

                    INSERT INTO [employee_app].[driver_table]

                    ([name]

                    ,[last_name]

                    ,[cell_phone]

                    ,[email]

                    ,[status])

                    VALUES

                    (?,?,?,?,?)

                """

        data= [(name,last_name,cell_phone,email,status)]

        cursor.executemany(query,data)

        cursor.commit()

        cursor.close()

        conn.close()

        body = {

            "statusCode": 200,

            "message": "Driver was usccesfully added",

            "data": ""

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def admin_delete_driver(event, context):

    try:

        driver_id = event.get('driver_id')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        query = f"""

                    update employee_app.trip_table set driver_id = 47 where driver_id = {driver_id}

                """

        cursor.execute(query)

        query = f"""

                    update employee_app.driver_table set status= 'disabled' where driver_id = {driver_id}

                """

        cursor.execute(query)

        cursor.commit()

        cursor.close()

        conn.close()

        body = {

            "statusCode": 200,

            "message": "Driver was succesfully deleted",

            "data": ""

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def admin_add_route(event, context):

    try:

        route_name = event.get('route_name')

        route_description = event.get('route_description')

        start_point = event.get('start_point')

        end_point = event.get('end_point')

        site_id = event.get('site_id')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        query = f"""

                    INSERT INTO [employee_app].[route_table]

                    ([route_name]

                    ,[route_description]

                    ,[start_point]

                    ,[end_point_point]

                    ,[site_id])

                    VALUES

                    (?,?,?,?,?)

                """

        data= [(route_name,route_description,start_point,end_point,site_id)]

        cursor.executemany(query,data)

        cursor.commit()

        cursor.close()

        conn.close()

        body = {

            "statusCode": 200,

            "message": "Route was usccesfully added",

            "data": ""

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def admin_delete_route(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "scripting"

        password = "0O%9d22lF$mIre6dCWue"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        route_id = event.get('route_id')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        query = f"""

                    delete from employee_app.route_table where route_id = ?

                """

        data= [route_id]

        cursor.executemany(query,[data])

        cursor.commit()

        cursor.close()

        conn.close()

        body = {

            "statusCode": 200,

            "message": "Route was succesfully deleted",

            "data": ""

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def test_new_form_image(event, context):

    try:

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        query = f"""

                    select * from employee_app.route_table

                """

        cursor.execute(query)

        cursor.commit()

        cursor.close()

        conn.close()

        body = {



            "statusCode": 200,

            "message": "Is for testing purposes only",

            "data": "Excelente 150!!"

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def admin_add_admin_user(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "scripting"

        password = "0O%9d22lF$mIre6dCWue"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        name = event.get('name')

        last_name = event.get('last_name')

        phone_number = event.get('phone_number')

        email = event.get('email')

        status = event.get('status')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        query = f"""

                    INSERT INTO [employee_app].[admin_user_table]

                    ([name]

                    ,[last_name]

                    ,[phone_number]

                    ,[email]

                    ,[status])

                    VALUES

                    (?,?,?,?,?)

                """

        data= [(name,last_name,phone_number,email,status)]

        cursor.executemany(query,data)

        cursor.commit()

        cursor.close()

        conn.close()

        body = {

            "statusCode": 200,

            "message": "Admin was usccesfully added",

            "data": ""

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while creating, maybe the user already exist. {e}",

            "data": ""

        } 

    return body



def admin_edit_admin_user(event, context):

    try:

        user_id = event.get('user_id')

        name = event.get('name')

        last_name = event.get('last_name')

        phone_number = event.get('phone_number')

        email = event.get('email')

        status = event.get('status')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        query = f"""

                    update employee_app.admin_user_table set 

                    name = '{name}',last_name = '{last_name}',phone_number = '{phone_number}',email = '{email}',

                    status = '{status}'

                    where user_id={user_id}

                """

        print(query)

        cursor.execute(query)

        cursor.commit()

        cursor.close()

        conn.close()

        body = {

            "statusCode": 200,

            "message": "Admin user was succesfully updated",

            "data": ""

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def admin_delete_admin_user(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "scripting"

        password = "0O%9d22lF$mIre6dCWue"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        admin_id = event.get('admin_id')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        query = f"""

                    update employee_app.admin_user_table set status = 'deleted' where user_id = ?

                """

        data= [admin_id]

        cursor.executemany(query,[data])

        cursor.commit()

        cursor.close()

        conn.close()

        body = {

            "statusCode": 200,

            "message": "User admin was succesfully deleted",

            "data": ""

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def admin_add_site(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "scripting"

        password = "0O%9d22lF$mIre6dCWue"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        site_name = event.get('site_name')

        country = event.get('country')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        query = f"""

                    INSERT INTO [employee_app].[sites_table]

                    ([site_name]

                    ,[country])

                    VALUES

                    (?,?)

                """

        data= [(site_name,country)]

        cursor.executemany(query,data)

        cursor.commit()

        cursor.close()

        conn.close()

        body = {

            "statusCode": 200,

            "message": "Site was usccesfully added",

            "data": ""

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def admin_edit_site(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "scripting"

        password = "0O%9d22lF$mIre6dCWue"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        site_id = event.get('site_id')

        site_name = event.get('site_name')

        country = event.get('country')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        query = f"""

                    update employee_app.sites_table set site_name = '{site_name}', country='{country}'

                    where site_id={site_id}

                """

        print(query)

        cursor.execute(query)

        cursor.commit()

        cursor.close()

        conn.close()

        body = {

            "statusCode": 200,

            "message": "Route was succesfully updated",

            "data": ""

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def admin_delete_site(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "scripting"

        password = "0O%9d22lF$mIre6dCWue"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        site_id = event.get('site_id')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        query = f"""

                    delete from employee_app.sites_table where site_id = ?

                """

        data= [site_id]

        cursor.executemany(query,[data])

        cursor.commit()

        cursor.close()

        conn.close()

        body = {

            "statusCode": 200,

            "message": "User admin was succesfully deleted",

            "data": ""

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def admin_add_trip(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "scripting"

        password = "0O%9d22lF$mIre6dCWue"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        vehicle_id = event.get('vehicle_id')

        route_id = event.get('route_id')

        driver_id = event.get('driver_id')

        date_begin = event.get('date_begin')

        #Route Creation

        route_name = event.get('route_name')

        route_description = event.get('route_description')

        start_point = event.get('start_point')

        end_point = event.get('end_point')

        site_id = event.get('site_id')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        if route_id == "":

            query = f"""

                    INSERT INTO [employee_app].[route_table]

                    ([route_name]

                    ,[route_description]

                    ,[start_point]

                    ,[end_point_point]

                    ,[site_id])

                    VALUES

                    (?,?,?,?,?)

                """

            data= [(route_name,route_description,start_point,end_point,site_id)]

            cursor.executemany(query,data)

            query1 = f"""select top(1) route_id from employee_app.route_table order by route_id desc

                """

            df = pd.read_sql_query(query1, conn, params=None)

            route_id = int(df["route_id"][0])

            query2 = f"""

                        INSERT INTO [employee_app].[trip_table]

                        ([vehicle_id]

                        ,[route_id]

                        ,[driver_id]

                        ,[date_begin]

                        ,[status])

                        VALUES

                        (?,?,?,?,'pending')

                    """

            data2= [(vehicle_id,route_id,driver_id,date_begin)]

            cursor.executemany(query2,data2)

            cursor.commit()

            cursor.close()

            conn.close()

        else:

            query = f"""

                        INSERT INTO [employee_app].[trip_table]

                        ([vehicle_id]

                        ,[route_id]

                        ,[driver_id]

                        ,[date_begin]

                        ,[status])

                        VALUES

                        (?,?,?,?,'pending')

                    """

            data= [(vehicle_id,route_id,driver_id,date_begin)]

            cursor.executemany(query,data)

            cursor.commit()

            cursor.close()

            conn.close()

        

        body = {

            "statusCode": 200,

            "message": "Trip was usccesfully added",

            "data": ""

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def admin_edit_trip(event, context):

    try:
        # Extract parameters from body if present, otherwise from root level
        body = event.get('body', {})
        
        trip_id = event.get('trip_id') or body.get('trip_id')

        vehicle_id = event.get('bus_id') or event.get('vehicle_id') or body.get('bus_id') or body.get('vehicle_id')

        route_id = event.get('route_id') or body.get('route_id')

        driver_id = event.get('driver_id') or body.get('driver_id')

        date_begin = event.get('date_begin') or body.get('date_begin')

        #Route Creation

        route_name = event.get('route_name') or body.get('route_name')

        route_description = event.get('route_description') or body.get('route_description')

        start_point = event.get('start_point') or body.get('start_point')

        end_point = event.get('end_point') or body.get('end_point')

        site_id = event.get('site_id') or body.get('site_id')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        if route_id == "":

            query = f"""

                    INSERT INTO [employee_app].[route_table]

                    ([route_name]

                    ,[route_description]

                    ,[start_point]

                    ,[end_point_point]

                    ,[site_id])

                    VALUES

                    (?,?,?,?,?)

                """

            data= [(route_name,route_description,start_point,end_point,site_id)]

            cursor.executemany(query,data)

            query1 = f"""select top(1) route_id from employee_app.route_table order by route_id desc"""

            df = pd.read_sql_query(query1, conn, params=None)

            route_id = int(df["route_id"][0])

            query2 = f"""

                        update employee_app.trip_table set vehicle_id = {vehicle_id}, route_id={route_id}, driver_id={driver_id},date_begin='{date_begin}'

                        where trip_id={trip_id}

                    """

            cursor.execute(query2)

            cursor.commit()

            cursor.close()

            conn.close()

        else:

            query =  f"""

                        update employee_app.trip_table set vehicle_id = {vehicle_id}, route_id={route_id}, driver_id={driver_id},date_begin='{date_begin}'

                        where trip_id={trip_id}

                    """

            cursor.execute(query)

            cursor.commit()

            cursor.close()

            conn.close()

        

        body = {

            "statusCode": 200,

            "message": "Trip was usccesfully edited",

            "data": ""

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def admin_delete_trip(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "scripting"

        password = "0O%9d22lF$mIre6dCWue"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        trip_id = event.get('trip_id')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        query = f"""

                    delete from employee_app.trip_table where trip_id = ?

                """

        data= [trip_id]

        cursor.executemany(query,[data])

        cursor.commit()

        cursor.close()

        conn.close()

        body = {

            "statusCode": 200,

            "message": "User admin was succesfully deleted",

            "data": ""

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def admin_get_busses(event, context):

    try:

        conn = get_db_connection()

        items_per_page = event.get('items_per_page')

        page = event.get('page')

        search_word = event.get('search_word')

        query_1 = f"""select vehicle_id, licence_plate_number, capacity, company, vehcile_type, year_vehicle, vehicle_model, vehicle_make from employee_app.vehicle_table

                        where licence_plate_number like '%{search_word}%'

                        or company like '%{search_word}%'

                        or vehcile_type like '%{search_word}%'

                        or vehicle_make like '%{search_word}%'

                        or CAST(capacity AS VARCHAR(10)) like '%{search_word}%'

                        ORDER BY vehicle_id asc;

                """

        total_rows = len(pd.read_sql_query(query_1, conn, params=None))

        total_pages = 0

        if total_rows != 0:

            total_pages = math.ceil(total_rows/items_per_page)

            query_2 = f"""select vehicle_id, licence_plate_number, capacity, company, vehcile_type, year_vehicle, vehicle_model, vehicle_make from employee_app.vehicle_table

                        where licence_plate_number like '%{search_word}%'

                        or company like '%{search_word}%'

                        or vehcile_type like '%{search_word}%'

                        or vehicle_make like '%{search_word}%'

                        or CAST(capacity AS VARCHAR(10)) like '%{search_word}%'

                        ORDER BY vehicle_id asc

                        OFFSET {items_per_page*(page-1)} ROWS

                        FETCH NEXT {items_per_page} ROWS ONLY;

                """

            df = pd.read_sql_query(query_2, conn, params=None)

            df.fillna(value='NULL', inplace=True)

            response = df.to_dict("records")

        else:

            response = "Error 403"

        body = {

            "statusCode": 200,

            "message": "Vehicles were successfully obtained", 

            "total_pages": total_pages,

            "total_rows": total_rows,

            "data": response

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def admin_get_detailed_route(event, context):

    try:

        conn = get_db_connection()

        route_id = event.get('route_id')

        query = f"""select route_id, route_name, route_description, start_point, end_point_point, a.site_id, b.site_name 

                    from employee_app.route_table a

                    join employee_app.sites_table b

                    on a.site_id = b.site_id 

                    where route_id = {route_id}

                """

        df = pd.read_sql_query(query, conn, params=None)

        body = {

            "statusCode": 200,

            "message": "The route information was obtained successfully", 

            "data": df.to_dict("records")

        }

        conn.close()

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def admin_delete_bus(event, context):

    try:

        bus_id = event.get('bus_id')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        query = f"""

                    update [employee_app].[vehicle_table] set status = 'disable' where vehicle_id = ?

                """

        data= [bus_id]

        cursor.executemany(query,[data])

        cursor.commit()

        cursor.close()

        conn.close()

        body = {

            "statusCode": 200,

            "message": "Vehicle was succesfully disabled",

            "data": ""

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def admin_edit_bus(event, context):

    try:

        vehicle_id = event.get('vehicle_id')

        plate = event.get('plate')

        capacity = event.get('capacity')

        company = event.get('company')

        vehicle_type = event.get('vehicle_type')

        year = event.get('year')

        model = event.get('model')

        make = event.get('make')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        query = f"""

                    update employee_app.vehicle_table set licence_plate_number = '{plate}', capacity={capacity}, company='{company}',vehcile_type='{vehicle_type}',year_vehicle={year},vehicle_model='{model}',vehicle_make='{make}'

                    where vehicle_id={vehicle_id}

                """

        cursor.execute(query)

        cursor.commit()

        cursor.close()

        conn.close()

        body = {

            "statusCode": 200,

            "message": "Vehicle was succesfully updated",

            "data": ""

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def admin_get_alerts(event, context):

    try:

        conn = get_db_connection()

        query = f"""select a.emrgency_register_id, b.name_as_key, a.date, a.latitude, a.longitude, a.trip_id from employee_app.emergency_register_table a

                    join employee_app.call_emergency b

                    on a.emergency_id = b.emergency_id

                    where a.state = 'pending'

                    order by a.emrgency_register_id desc;

                """

        df = pd.read_sql_query(query, conn, params=None)

        df["date"] = df["date"].astype(str)

        body = {

            "statusCode": 200,

            "message": "The alerts information was obtained successfully", 

            "data": df.to_dict("records")

        }

        conn.close()

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def admin_edit_alert(event, context):

    try:

        emrgency_register_id = event.get('emrgency_register_id')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        query = f"""

                    update employee_app.emergency_register_table set state = 'attended' 

                    where emrgency_register_id = {emrgency_register_id};

                """

        cursor.execute(query)

        cursor.commit()

        cursor.close()

        conn.close()

        body = {

            "statusCode": 200,

            "message": "Alert was succesfully updated",

            "data": ""

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def cognito_pre_signup(event, context):

    try:

        event['response']['autoConfirmUser'] = False

        email = event['request']['userAttributes']['email']

        conn = get_db_connection()

        query = f"""select employee_id from [employee_app].employee_table

                    where email = '{email}'

                """

        df = pd.read_sql_query(query, conn, params=None)

        

        print(df.to_dict("records"))



        if df.to_dict("records") in event['request']['userAttributes']:

            event['response']['autoConfirmUser'] = True



    except Exception as e:

        print("Error")

        event['response']['autoConfirmUser'] = False



    return event



def admin_edit_driver(event, context):

    try:

        driver_id = event.get('driver_id')

        name = event.get('name')

        last_name = event.get('last_name')

        cell_phone = event.get('cell_phone')

        email = event.get('email')

        status = event.get('status')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        query = f"""

                    update employee_app.driver_table set 

                    name = '{name}',last_name = '{last_name}',cell_phone = '{cell_phone}',email = '{email}',

                    status = '{status}'

                    where driver_id={driver_id}

                """

        print(query)

        cursor.execute(query)

        cursor.commit()

        cursor.close()

        conn.close()

        body = {

            "statusCode": 200,

            "message": "Driver was succesfully updated",

            "data": ""

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def admin_get_alerts(event, context):

    try:

        conn = get_db_connection()

        query = f"""select a.emrgency_register_id, b.name_as_key, a.date, a.latitude, a.longitude, a.trip_id from employee_app.emergency_register_table a

                    join employee_app.call_emergency b

                    on a.emergency_id = b.emergency_id

                    where a.state = 'pending'

                    order by a.emrgency_register_id desc;

                """

        df = pd.read_sql_query(query, conn, params=None)

        df["date"] = df["date"].astype(str)

        body = {

            "statusCode": 200,

            "message": "The alerts information was obtained successfully", 

            "data": df.to_dict("records")

        }

        conn.close()

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def admin_get_trip_by_id(event, context):

    try:

        trip_id = event.get('trip_id')

        conn = get_db_connection()

        query = f"""select a.vehicle_id, a.route_id,a.date_begin, a.date_end, a.status, a.driver_id, a.trip_id, b.route_name, b.route_description, b.start_point, b.end_point_point, b.site_id, c.site_name, CONCAT(d.name, ' ',d.last_name) as driver_name

                    from employee_app.trip_table a

                    join employee_app.route_table b on a.route_id = b.route_id

                    join employee_app.sites_table c on b.site_id = c.site_id

                    join employee_app.driver_table d on a.driver_id = d.driver_id

                    where a.trip_id = {trip_id};

                """

        df = pd.read_sql_query(query, conn, params=None)

        df["date_begin"] = df["date_begin"].astype(str)

        df["date_end"] = df["date_end"].astype(str)

        df["route_name"] = df["route_name"].str.split().str.join(' ')

        df["route_description"] = df["route_description"].str.split().str.join(' ')

        data = df.to_dict("records")[0]

        query2 = f"""select count(reserve_id) as bookings_pending_count from employee_app.reserve_table

                     where trip_id = {trip_id} and flaq = 'pending'

                """

        df2 = pd.read_sql_query(query2, conn, params=None)

        data["bookings_pending_count"] = df2["bookings_pending_count"][0]

        query3 = f"""select count(reserve_id) as passengers_count from employee_app.reserve_table

                        where trip_id = {trip_id} and flaq = 'completed'

                """

        df3 = pd.read_sql_query(query3, conn, params=None)

        data["passengers_count"] = df3["passengers_count"][0]

        body = {

            "statusCode": 200,

            "message": "Insights were succesfully obtained", 

            "data": str(data)

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body


def employee_get_future_bookings(event, context):
    try:
        # Get database credentials from individual Secrets Manager secrets
        secrets_client = boto3.client('secretsmanager', region_name='us-east-1')
        
        hostname_response = secrets_client.get_secret_value(SecretId='db_server')
        hostname = hostname_response['SecretString']  # Plain text, not JSON
        
        username_response = secrets_client.get_secret_value(SecretId='db_user_dev')
        username = username_response['SecretString']  # Plain text
        
        password_response = secrets_client.get_secret_value(SecretId='db_password_dev')
        password = password_response['SecretString']  # Plain text
        
        database_response = secrets_client.get_secret_value(SecretId='db_name_dev')
        database = database_response['SecretString']  # Plain text
        
        connstring_local = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"
        conn = pyodbc.connect(connstring_local, autocommit=False)
        
        hrm_id = event.get('hrm_id')
        page_size = event.get('page_size', 20)
        page_number = event.get('page_number', 1)
        
        # Query to get future bookings for the employee
        query_1 = f"""select C.route_name, A.trip_id, B.date_begin from employee_app.reserve_table A
                        join employee_app.trip_table B
                        on A.trip_id=B.trip_id
                        join employee_app.route_table C
                        on B.route_id=C.route_id
                        where A.employee_id = {hrm_id} 
                        and A.flaq = 'pending'
                        and CAST(B.date_begin AS DATE) >= CAST(GETDATE() AS DATE)
                        ORDER BY B.date_begin ASC
                """
        
        total_rows = len(pd.read_sql_query(query_1, conn, params=None))
        total_pages = math.ceil(total_rows/page_size) if total_rows > 0 else 1
        
        query_2 = f"""select C.route_name, A.trip_id, B.date_begin from employee_app.reserve_table A
                        join employee_app.trip_table B
                        on A.trip_id=B.trip_id
                        join employee_app.route_table C
                        on B.route_id=C.route_id
                        where A.employee_id = {hrm_id} 
                        and A.flaq = 'pending'
                        and CAST(B.date_begin AS DATE) >= CAST(GETDATE() AS DATE)
                    ORDER BY B.date_begin ASC
                    OFFSET {page_size*(page_number-1)} ROWS
                    FETCH NEXT {page_size} ROWS ONLY;
                """
        
        df = pd.read_sql_query(query_2, conn, params=None)
        df["date_begin"] = df["date_begin"].astype(str)
        
        body = {
            "statusCode": 200,
            "message": "Future employee's reserves were successfully obtained", 
            "total_pages": total_pages,
            "data": df.to_dict("records")
        }
        
    except Exception as e:
        print(f"Error in employee_get_future_bookings: {str(e)}")
        body = {
            "statusCode": 400,
            "message": f"ERROR while getting future bookings: {str(e)}",
            "data": ""
        } 
    
    return body


def admin_get_trip_passengers(event, context):

    try:

        trip_id = event.get('trip_id')

        conn = get_db_connection()

        query = f"""select a.employee_id, b.name, b.last_name, b.employee_id, a.flaq as status_booking from employee_app.reserve_table a 

                        join employee_app.employee_table b on a.employee_id = b.employee_id

                        where flaq in ('completed','pending')

                        and trip_id = {trip_id}

                """

        df = pd.read_sql_query(query, conn, params=None)

        body = {

            "statusCode": 200,

            "message": "Passengers were successfully obtained", 

            "data": df.to_dict("records")

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def admin_add_bus(event, context):

    try:

        plate = event.get('plate')

        capacity = event.get('capacity')

        company = event.get('company')

        vehicle_type = event.get('vehicle_type')

        year = event.get('year')

        model = event.get('model')

        make = event.get('make')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        query = f"""

                    INSERT INTO [employee_app].[vehicle_table]

                    ([licence_plate_number],[capacity],[company],[vehcile_type],[year_vehicle],[vehicle_model],[vehicle_make])

                    VALUES

                    (?,?,?,?,?,?,?)

                """

        data= [(plate,capacity,company,vehicle_type,year,model,make)]

        cursor.executemany(query,data)

        cursor.commit()

        cursor.close()

        conn.close()

        body = {

            "statusCode": 200,

            "message": "Bus was usccesfully added",

            "data": ""

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def admin_edit_route(event, context):

    try:

        route_id = event.get('route_id')

        route_name = event.get('route_name')

        route_description = event.get('route_description')

        start_point = event.get('start_point')

        end_point = event.get('end_point')

        site_id = event.get('site_id')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        query = f"""

                    UPDATE [employee_app].[route_table] SET 

                    [route_name] = '{route_name}'

                    ,[route_description] = '{route_description}'

                    ,[start_point] = '{start_point}'

                    ,[end_point_point] = '{end_point}'

                    ,[site_id] = {site_id}

                    WHERE ROUTE_ID = {route_id}

                """

        cursor.execute(query)

        cursor.commit()

        cursor.close()

        conn.close()

        body = {

            "statusCode": 200,

            "message": "Route was usccesfully added",

            "data": ""

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting info. {e}",

            "data": ""

        } 

    return body



def check_passenger_reserve_v2(event, context):

    try:

        hrm_id = event.get('hrm_id')

        trip_id = event.get('trip_id')

        conn = get_db_connection()

        query = f"""

                    if exists(select * from employee_app.reserve_table where employee_id ={hrm_id} and trip_id= {trip_id})

                    select employee_id as hrm_id, name, last_name, 'TRUE' as flaq from employee_app.employee_table where employee_id ={hrm_id}

                    else

                    select employee_id as hrm_id, name, last_name, 'FALSE' as flaq from employee_app.employee_table where employee_id ={hrm_id};

                """

        df = pd.read_sql_query(query, conn, params=None)

        df["flaq"] = df["flaq"].map({'FALSE':False, 'TRUE':True})

        body = {

            "statusCode": 200,

            "message": "Employee reserve information successfully obtained", 

            "data": df.to_dict("records")

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting employee. {e}",

            "data": ""

        } 

    return body 



def get_admin_user_information(event, context):

    try:

        email = event.get('email')

        conn = get_db_connection()

        query = f"""

                    SELECT a.user_id, a.name, a.last_name, a.phone_number, a.email from employee_app.admin_user_table as a where a.email = '{email}';

                """

        df = pd.read_sql_query(query, conn, params=None)

        body = {

            "statusCode": 200,

            "message": "Employee information successfully obtained", 

            "data": df.to_dict("records")

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting employee. {e}",

            "data": ""

        } 

    return body



def admin_get_version(event, context):

    try:

        conn = get_db_connection()

        query = f"""

                    SELECT * from employee_app.version_table;

                """

        df = pd.read_sql_query(query, conn, params=None)

        body = {

            "statusCode": 200,

            "message": "App version information successfully obtained", 

            "data": df.to_dict("records")

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting version. {e}",

            "data": ""

        } 

    return body



def employee_create_booking2(event, context):

    try:

        hostname = "itel-db-server.database.windows.net"

        username = "scripting"

        password = "0O%9d22lF$mIre6dCWue"

        database = "itel_datasi"

        connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"

        employee_id = event.get('employee_id')

        trip_id = event.get('trip_id')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        query = f"""

                    DECLARE @condicion BIT;

                    DECLARE @rows INT;

                    SET @rows = (

                        select COUNT(c.reserve_id) as a

                        from employee_app.trip_table a

                        join employee_app.vehicle_table b

                        on a.vehicle_id=b.vehicle_id

                        join employee_app.reserve_table c

                        on a.trip_id = c.trip_id

                        where c.flaq in ('completed','pending')

                        and a.trip_id = {trip_id}

						

					);

					SET @condicion = (

                        select

						CASE WHEN @rows < b.capacity THEN 'TRUE' ELSE 'FALSE' END AS flag

                        from employee_app.trip_table a

                        join employee_app.vehicle_table b

                        on a.vehicle_id=b.vehicle_id

                        and a.trip_id = {trip_id}

                        group by a.trip_id, b.capacity



					);

					IF NOT EXISTS (

                        select * from employee_app.reserve_table where employee_id={employee_id} and trip_id={trip_id} and flaq in ('completed','pending')

                    ) AND @condicion = 'TRUE'

                    BEGIN

                        INSERT INTO employee_app.reserve_table ([employee_id],[trip_id],[reservation_date],[flaq])

                        VALUES ({employee_id},{trip_id},cast(CONVERT(datetime, SWITCHOFFSET(SYSDATETIMEOFFSET(), DATEPART(TZOFFSET,SYSDATETIMEOFFSET() AT TIME ZONE 'Central Standard Time'))) as datetime),'pending')

                    END;

                """

        cursor.execute(query)

        cursor.commit()

        cursor.close()

        conn.close()

        conn = get_db_connection()

        query = f"""

                    SELECT A.*, B.route_name, B.route_description from 

                    employee_app.trip_table A

                    join employee_app.route_table B

                    on A.route_id=B.route_id

                    where A.trip_id = {trip_id}

                    AND EXISTS (select * from employee_app.reserve_table where employee_id={employee_id} and trip_id={trip_id});

                """

        df = pd.read_sql_query(query, conn, params=None)

        df["date_begin"] = df["date_begin"].astype(str)

        df["date_end"] = df["date_end"].astype(str)

        if len(df.to_dict("records"))==0:

            body = {

                    "statusCode": 400,

                    "message": "No bookings available",

                    "keyName": "NoSpaceAvailable"

            }

        else:

            body = {

            "statusCode": 200,

            "message": "Trip info successfully obtained", 

            "data": df.to_dict("records")

            } 

        

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR creating booking. {e}",

            "data": ""

        }      

    return body



def cancel_pending_bookings(event, context):

    try:

        trip_id = event.get('trip_id')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        query = f"""

                    UPDATE employee_app.reserve_table set flaq= 'canceled' where trip_id = {trip_id} and flaq = 'pending';

                """

        cursor.execute(query)

        cursor.commit()

        cursor.close()

        conn.close()

        body = {

            "statusCode": 200,

            "message": "Bookings canceled", 

            "data": ""

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR canceling bookings. {e}",

            "data": ""

        }      

    return body



def search_employee_by_hrm(event, context):

    try:

        hrm_id = event.get('hrm_id')

        conn = get_db_connection()

        query = f"""

                    select employee_id as hrm_id, name, last_name from employee_app.employee_table where employee_id = {hrm_id};

                """

        df = pd.read_sql_query(query, conn, params=None)

        body = {

            "statusCode": 200,

            "message": "Employee information successfully obtained", 

            "data": df.to_dict("records")

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting employee. {e}",

            "data": ""

        } 

    return body



def search_multiple_employees_by_hrm(event, context):

    try:

        hrms_ids = event.get('hrms_ids')

        conn = get_db_connection()

        query = f"""

                    select employee_id as hrm_id, name, last_name, email from employee_app.employee_table where employee_id in ({hrms_ids});

                """

        df = pd.read_sql_query(query, conn, params=None)

        body = {

            "statusCode": 200,

            "message": "Employees information successfully obtained", 

            "data": df.to_dict("records")

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR while getting employees. {e}",

            "data": event.get('hrms_ids')

        }

    return body



def admin_update_route_alignment(event, context):
    try:
        conn = get_db_connection()
        
        # Handle both direct invocation and API Gateway events
        if 'pathParameters' in event and event['pathParameters']:
            route_alignment_id = event['pathParameters']['id']
            body_data = json.loads(event.get('body', '{}'))
        else:
            # Direct invocation
            route_alignment_id = event.get('id')
            body_data = event
        
        country = body_data.get('country')
        city = body_data.get('city')
        community = body_data.get('community')
        
        if not all([route_alignment_id, country, city, community]):
            raise ValueError("Missing required fields: id, country, city, community")
        
        # Update route alignment
        update_query = """
            UPDATE employee_app.route_alignment 
            SET country = ?, city = ?, community = ?
            WHERE id = ?
        """
        
        cursor = conn.cursor()
        cursor.execute(update_query, (country, city, community, route_alignment_id))
        conn.commit()
        
        body = {
            "statusCode": 200,
            "message": "Route alignment updated successfully"
        }
        
        # Return proper API Gateway response format
        if 'pathParameters' in event:
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Methods': 'GET,PUT,DELETE,OPTIONS'
                },
                'body': json.dumps(body, cls=CustomJSONEncoder)
            }
        else:
            return body
        
    except Exception as e:
        error_body = {
            "statusCode": 400,
            "message": f"ERROR while updating route alignment. {e}"
        }
        
        if 'pathParameters' in event:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Methods': 'GET,PUT,DELETE,OPTIONS'
                },
                'body': json.dumps(error_body, cls=CustomJSONEncoder)
            }
        else:
            return error_body


def admin_delete_route_alignment(event, context):
    try:
        conn = get_db_connection()
        
        # Handle both direct invocation and API Gateway events
        if 'pathParameters' in event and event['pathParameters']:
            route_alignment_id = event['pathParameters']['id']
        else:
            # Direct invocation
            route_alignment_id = event.get('id')
        
        if not route_alignment_id:
            raise ValueError("Missing required field: id")
        
        # Delete route alignment
        delete_query = "DELETE FROM employee_app.route_alignment WHERE id = ?"
        
        cursor = conn.cursor()
        cursor.execute(delete_query, (route_alignment_id,))
        conn.commit()
        
        body = {
            "statusCode": 200,
            "message": "Route alignment deleted successfully"
        }
        
        # Return proper API Gateway response format
        if 'pathParameters' in event:
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Methods': 'GET,PUT,DELETE,OPTIONS'
                },
                'body': json.dumps(body, cls=CustomJSONEncoder)
            }
        else:
            return body
        
    except Exception as e:
        error_body = {
            "statusCode": 400,
            "message": f"ERROR while deleting route alignment. {e}"
        }
        
        if 'pathParameters' in event:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Methods': 'GET,PUT,DELETE,OPTIONS'
                },
                'body': json.dumps(error_body, cls=CustomJSONEncoder)
            }
        else:
            return error_body


def admin_create_route_alignment(event, context):
    try:
        conn = get_db_connection()
        
        # Handle both direct invocation and API Gateway events
        if 'body' in event:
            body_data = json.loads(event.get('body', '{}'))
        else:
            # Direct invocation
            body_data = event
        
        country = body_data.get('country')
        city = body_data.get('city')
        community = body_data.get('community')
        
        if not all([country, city, community]):
            raise ValueError("Missing required fields: country, city, community")
        
        # Insert route alignment
        insert_query = """
            INSERT INTO employee_app.route_alignment (country, city, community, created_date, is_active)
            VALUES (?, ?, ?, GETDATE(), 1)
        """
        
        cursor = conn.cursor()
        cursor.execute(insert_query, (country, city, community))
        conn.commit()
        
        body = {
            "statusCode": 200,
            "message": "Route alignment created successfully"
        }
        
        # Return proper API Gateway response format
        if 'body' in event:
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Methods': 'GET,PUT,DELETE,OPTIONS'
                },
                'body': json.dumps(body, cls=CustomJSONEncoder)
            }
        else:
            return body
        
    except Exception as e:
        error_body = {
            "statusCode": 400,
            "message": f"ERROR while creating route alignment. {e}"
        }
        
        if 'body' in event:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Methods': 'GET,PUT,DELETE,OPTIONS'
                },
                'body': json.dumps(error_body, cls=CustomJSONEncoder)
            }
        else:
            return error_body


def admin_get_route_alignment_filters(event, context):
    try:
        conn = get_db_connection()
        
        # Get all unique countries
        countries_query = "SELECT DISTINCT country FROM employee_app.route_alignment WHERE country IS NOT NULL ORDER BY country"
        countries_df = pd.read_sql_query(countries_query, conn)
        countries = countries_df['country'].tolist()
        
        # Get all unique cities
        cities_query = "SELECT DISTINCT city FROM employee_app.route_alignment WHERE city IS NOT NULL ORDER BY city"
        cities_df = pd.read_sql_query(cities_query, conn)
        cities = cities_df['city'].tolist()
        
        body = {
            "statusCode": 200,
            "message": "Route alignment filters successfully obtained",
            "countries": countries,
            "cities": cities
        }
        
        # Return proper API Gateway response format
        if 'queryStringParameters' in event:
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Methods': 'GET,OPTIONS'
                },
                'body': json.dumps(body, cls=CustomJSONEncoder)
            }
        else:
            return body
            
    except Exception as e:
        error_body = {
            "statusCode": 400,
            "message": f"ERROR while getting route alignment filters. {e}",
            "countries": [],
            "cities": []
        }
        
        if 'queryStringParameters' in event:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Methods': 'GET,OPTIONS'
                },
                'body': json.dumps(error_body, cls=CustomJSONEncoder)
            }
        else:
            return error_body


def admin_get_route_alignments(event, context):
    try:
        conn = get_db_connection()
        
        # Handle both direct invocation and API Gateway events
        if 'queryStringParameters' in event and event['queryStringParameters']:
            params = event['queryStringParameters']
            search_word = params.get('search_word', '')
            page = int(params.get('page', 1))
            items_per_page = int(params.get('items_per_page', 20))
            order_by_key_name = params.get('order_by_key_name', 'id')
            order_by_is_desc = params.get('order_by_is_desc', 'false').lower() == 'true'
            country_filter = params.get('country_filter', '')
            city_filter = params.get('city_filter', '')
        else:
            # Direct invocation
            search_word = event.get('search_word', '')
            page = int(event.get('page', 1))
            items_per_page = int(event.get('items_per_page', 20))
            order_by_key_name = event.get('order_by_key_name', 'id')
            order_by_is_desc = event.get('order_by_is_desc', 'false').lower() == 'true'
            country_filter = event.get('country_filter', '')
            city_filter = event.get('city_filter', '')
        
        # Calculate offset
        offset = (page - 1) * items_per_page
        
        # Build ORDER BY clause
        order_direction = 'DESC' if order_by_is_desc else 'ASC'
        order_clause = f"ORDER BY {order_by_key_name} {order_direction}"
        
        # Build WHERE clause for search and filters
        where_conditions = []
        
        if search_word:
            where_conditions.append(f"(country LIKE '%{search_word}%' OR city LIKE '%{search_word}%' OR community LIKE '%{search_word}%')")
        
        if country_filter:
            where_conditions.append(f"country = '{country_filter}'")
            
        if city_filter:
            where_conditions.append(f"city = '{city_filter}'")
        
        where_clause = ""
        if where_conditions:
            where_clause = "WHERE " + " AND ".join(where_conditions)
        
        # Get total count
        count_query = f"""
            SELECT COUNT(*) as total_count 
            FROM employee_app.route_alignment 
            {where_clause}
        """
        
        count_df = pd.read_sql_query(count_query, conn)
        total_rows = int(count_df.iloc[0]['total_count'])
        total_pages = math.ceil(total_rows / items_per_page)
        
        # Get paginated data
        data_query = f"""
            SELECT id, country, city, community, created_date, is_active
            FROM employee_app.route_alignment 
            {where_clause}
            {order_clause}
            OFFSET {offset} ROWS 
            FETCH NEXT {items_per_page} ROWS ONLY
        """
        
        print(data_query)
        
        df = pd.read_sql_query(data_query, conn)
        
        # Get filter options (all unique countries and cities)
        countries_query = "SELECT DISTINCT country FROM employee_app.route_alignment WHERE country IS NOT NULL ORDER BY country"
        cities_query = "SELECT DISTINCT city FROM employee_app.route_alignment WHERE city IS NOT NULL ORDER BY city"
        
        countries_df = pd.read_sql_query(countries_query, conn)
        cities_df = pd.read_sql_query(cities_query, conn)
        
        countries = countries_df['country'].tolist()
        cities = cities_df['city'].tolist()
        
        # Convert DataFrame to dict and handle datetime serialization
        records = df.to_dict("records")
        for record in records:
            for key, value in record.items():
                if pd.isna(value):
                    record[key] = None
                elif hasattr(value, 'isoformat'):  # datetime objects
                    record[key] = value.isoformat()
        
        body = {
            "statusCode": 200,
            "message": "Route alignments were successfully obtained",
            "route_alignments": records,
            "current_page": page,
            "total_pages": total_pages,
            "total_rows": total_rows,
            "countries": countries,
            "cities": cities,
            "orderBy": {
                "keyName": order_by_key_name,
                "isDesc": order_by_is_desc
            }
        }
        
        # Return proper API Gateway response format
        if 'queryStringParameters' in event:
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Methods': 'GET,OPTIONS'
                },
                'body': json.dumps(body, cls=CustomJSONEncoder)
            }
        else:
            return body
        
    except Exception as e:
        error_body = {
            "statusCode": 400,
            "message": f"ERROR while getting route alignments. {e}",
            "route_alignments": []
        }
        
        if 'queryStringParameters' in event:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Methods': 'GET,OPTIONS'
                },
                'body': json.dumps(error_body, cls=CustomJSONEncoder)
            }
        else:
            return error_body


def new_api_sites(event, context):

    try:

        site_id = event.get('site_id')

        conn = get_db_connection()

        cursor= conn.cursor()

        cursor.fast_executemany= True

        query = f"""

                    select * from employee_app.sites_table where site_id = '{site_id}';

                """

        df = pd.read_sql_query(query, conn, params=None)

        cursor.execute(query)

        cursor.commit()

        cursor.close()

        conn.close()

        body = {

            "statusCode": 200,

            "message": "Sites obtained", 

            "data": df.to_dict("records")

        }

    except Exception as e:

        body = {

            "statusCode": 400,

            "message": f"ERROR getting sites. {e}",

            "data": ""

        }      

    return body



lambdas_functions = {

    ## lambdas for transportation project

    ### trips api

    "get_prev_trip": get_prev_trip,

    "get_possible_trips": get_possible_trips,

    "get_driver_current_trip": get_driver_current_trip,

    "add_passenger_to_trip":add_passenger_to_trip,

    "pre_signup_validations": pre_signup_validations,

    "check_passenger_reserve":check_passenger_reserve,

    "start_trip":start_trip,

    "end_trip":end_trip,

    "get_trip_passengers":get_trip_passengers,

    "get_user_information": get_user_information,

    "get_driver_information": get_driver_information,

    "get_employee_info": get_employee_info,

    "employee_get_countries": employee_get_countries,

    "employee_create_booking": employee_create_booking,

    "employee_cancel_booking":employee_cancel_booking,

    "employee_get_routes_by_site":employee_get_routes_by_site,

    "employee_get_stops_by_city":employee_get_stops_by_city,

    "employee_get_initial_data":employee_get_initial_data,

    "admin_clear_bookings":admin_clear_bookings,

    "admin_add_trips":admin_add_trips,

    "employee_get_trip_by_route_date":employee_get_trip_by_route_date,

    "driver_get_previous_trips":driver_get_previous_trips,

    "driver_get_future_trips":driver_get_future_trips,

    "employee_get_current_trip":employee_get_current_trip,

    "employee_get_prev_bookings":employee_get_prev_bookings,

    "employee_get_future_bookings":employee_get_future_bookings,

    "driver_update_position":driver_update_position,

    "get_driver_update_position":get_driver_update_position,

    "driver_get_trip_info":driver_get_trip_info,

    "call_emergency":call_emergency,

    "get_code_emergency":get_code_emergency,

    "employee_get_countries":employee_get_countries,

    "employee_get_sites":employee_get_sites,

    "employee_get_info":employee_get_info,

    "employee_get_trip_info":employee_get_trip_info,

    "delete_employee_info":delete_employee_info,

    "delete_driver_info":delete_driver_info,

    "create_employee":create_employee,

    "create_driver":create_driver,

    "admin_get_users_count":admin_get_users_count,

    "admin_get_sites":admin_get_sites,

    "admin_get_routes":admin_get_routes,

    "admin_get_trips":admin_get_trips,

    "admin_get_all_dashboard_users":admin_get_all_dashboard_users,

    "admin_get_trips_count":admin_get_trips_count,

    "get_employee_login_validation": get_employee_login_validation,

    "admin_search_trips":admin_search_trips,

    "admin_get_all_drivers":admin_get_all_drivers,

    "admin_delete_driver":admin_delete_driver,

    "admin_add_driver":admin_add_driver,

    "admin_delete_route":admin_delete_route,

    "test_new_form_image": test_new_form_image,

    "admin_add_admin_user":admin_add_admin_user,

    "admin_edit_admin_user":admin_edit_admin_user,

    "admin_delete_admin_user":admin_delete_admin_user,

    "admin_add_site":admin_add_site,

    "admin_edit_site":admin_edit_site,

    "admin_delete_site":admin_delete_site,

    "admin_add_trip":admin_add_trip,

    "admin_edit_trip":admin_edit_trip,

    "admin_delete_trip":admin_delete_trip,

    "admin_get_busses":admin_get_busses,

    "admin_get_detailed_route":admin_get_detailed_route,

    "admin_delete_bus":admin_delete_bus,

    "admin_edit_bus":admin_edit_bus,

    "admin_get_alerts":admin_get_alerts,

    "admin_edit_alert":admin_edit_alert,

    "admin_add_route":admin_add_route,

    "cognito_pre_signup":cognito_pre_signup,

    "admin_edit_driver":admin_edit_driver,

    "admin_get_trip_by_id":admin_get_trip_by_id,

    "admin_add_bus":admin_add_bus,

    "admin_edit_route":admin_edit_route,

    "employee_get_future_bookings":employee_get_future_bookings,

    "check_passenger_reserve_v2":check_passenger_reserve_v2,

    "get_admin_user_information":get_admin_user_information,

    "admin_get_version":admin_get_version,

    "admin_get_trip_passengers":admin_get_trip_passengers,

    "employee_create_booking2":employee_create_booking2,

    "cancel_pending_bookings":cancel_pending_bookings,

    "search_employee_by_hrm": search_employee_by_hrm,

    "search_multiple_employees_by_hrm": search_multiple_employees_by_hrm,

    "new_api_sites": new_api_sites,

    "admin_get_route_alignments": admin_get_route_alignments,

    "admin_get_route_alignment_filters": admin_get_route_alignment_filters



}





#handler({"lambda_function_name": "new_api_sites","site_id":5}, {})

#handler({"lambda_function_name": "admin_get_trips_count"}, {})

# handler({"lambda_function_name": "get_driver_current_trip"}, {})

# handler({"lambda_function_name": "add_passenger_to_trip"}, {})

# handler({"lambda_function_name": "pre_signup_validations"}, {})

# handler({"lambda_function_name": "driver_get_trip_info", "trip_id": 20}, {})

# handler({ "lambda_function_name": "admin_add_bus","plate": 'JDU1234',"capacity": '30',"company": 'testCom',"vehicle_type":'coaster',"year": '2023',"model": '',"make": 'toyota'}, {})

#handler({"lambda_function_name": "admin_edit_route","route_id":32,"route_name":'cambio nombre',"route_description":'descripcion nueva',"start_point": '18.276838009050113, -78.02269220795442',"end_point":'2.13, 4526',"site_id":0}, {})

# handler({"lambda_function_name": "admin_edit_admin_user", "user_id": 1, "name":'Marlon',"last_name":'Edited',"phone_number":314286120,"email":'acg@ii',"status":'enable'}, {})

#handler({"lambda_function_name": "admin_get_all_dashboard_users", "items_per_page": 20,"page":1,"search_word":''}, {})

#handler({"lambda_function_name": "admin_get_busses","items_per_page": 20,"page":1,"search_word":''}, {})

#handler({"lambda_function_name": "check_passenger_reserve_v2","trip_id":205, "hrm_id":808333},{})

# handler({"search_employee_by_hrm": "search_employee_by_hrm","hrm_id":791093}, {})

def admin_get_location_preferences_summary(event, context):
    """Handle GET /dashboard/location-preferences/summary"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get country-level summary
        summary_query = """
        SELECT 
            country,
            COUNT(*) as response_count,
            COUNT(DISTINCT employee_id) as unique_employees,
            (SELECT COUNT(*) FROM employee_app.employee_table WHERE status = 'active') as total_employees
        FROM employee_app.location_preferences 
        WHERE is_active = 1 
        AND period_end >= GETDATE()
        GROUP BY country
        ORDER BY response_count DESC
        """
        
        cursor.execute(summary_query)
        summary_results = []
        for row in cursor.fetchall():
            result = {
                'country': row[0],
                'response_count': row[1],
                'unique_employees': row[2],
                'total_employees': row[3]
            }
            result['response_rate'] = round((result['unique_employees'] / result['total_employees']) * 100, 1)
            summary_results.append(result)
        
        # Get time preference summary
        time_query = """
        SELECT 
            preferred_timeframe,
            COUNT(*) as request_count
        FROM employee_app.location_preferences 
        WHERE is_active = 1 
        AND period_end >= GETDATE()
        GROUP BY preferred_timeframe
        ORDER BY request_count DESC
        """
        
        cursor.execute(time_query)
        time_results = []
        for row in cursor.fetchall():
            time_results.append({
                'preferred_timeframe': row[0],
                'request_count': row[1]
            })
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'GET,OPTIONS'
            },
            'body': json.dumps({
                'statusCode': 200,
                'message': 'Location preferences summary retrieved successfully',
                'data': {
                    'country_summary': summary_results,
                    'time_preferences': time_results
                }
            }, cls=CustomJSONEncoder)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'GET,OPTIONS'
            },
            'body': json.dumps({
                'statusCode': 500,
                'message': f'Error retrieving location preferences summary: {str(e)}'
            })
        }

def admin_get_location_preferences_by_country(event, context):
    """Handle GET /dashboard/location-preferences/country/{country}"""
    try:
        import urllib.parse
        
        # Get country from path parameters
        country = event.get('pathParameters', {}).get('country')
        print(f"Raw country parameter: {country}")
        
        if not country:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Methods': 'GET,OPTIONS'
                },
                'body': json.dumps({
                    'statusCode': 400,
                    'message': 'Country parameter is required'
                })
            }
        
        # URL decode the country parameter
        country = urllib.parse.unquote(country)
        print(f"Decoded country parameter: {country}")
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get pickup location breakdown
        pickup_query = """
        SELECT 
            pickup_location,
            COUNT(*) as request_count,
            ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM employee_app.location_preferences WHERE country = ? AND is_active = 1 AND period_end >= GETDATE()), 1) as percentage
        FROM employee_app.location_preferences 
        WHERE country = ? 
        AND is_active = 1 
        AND period_end >= GETDATE()
        GROUP BY pickup_location
        ORDER BY request_count DESC
        """
        
        cursor.execute(pickup_query, (country, country))
        pickup_results = []
        for row in cursor.fetchall():
            pickup_results.append({
                'pickup_location': row[0],
                'request_count': row[1],
                'percentage': row[2]
            })
        
        # Get dropoff location breakdown
        dropoff_query = """
        SELECT 
            dropoff_location,
            COUNT(*) as request_count,
            ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM employee_app.location_preferences WHERE country = ? AND is_active = 1 AND period_end >= GETDATE()), 1) as percentage
        FROM employee_app.location_preferences 
        WHERE country = ? 
        AND is_active = 1 
        AND period_end >= GETDATE()
        GROUP BY dropoff_location
        ORDER BY request_count DESC
        """
        
        cursor.execute(dropoff_query, (country, country))
        dropoff_results = []
        for row in cursor.fetchall():
            dropoff_results.append({
                'dropoff_location': row[0],
                'request_count': row[1],
                'percentage': row[2]
            })
        
        # Get time preference breakdown for this country
        time_query = """
        SELECT 
            preferred_timeframe,
            COUNT(*) as request_count,
            ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM employee_app.location_preferences WHERE country = ? AND is_active = 1 AND period_end >= GETDATE()), 1) as percentage
        FROM employee_app.location_preferences 
        WHERE country = ? 
        AND is_active = 1 
        AND period_end >= GETDATE()
        GROUP BY preferred_timeframe
        ORDER BY request_count DESC
        """
        
        cursor.execute(time_query, (country, country))
        time_results = []
        for row in cursor.fetchall():
            time_results.append({
                'preferred_timeframe': row[0],
                'request_count': row[1],
                'percentage': row[2]
            })
        
        # Get route combinations (pickup + dropoff) with 3+ requests
        route_combinations_query = """
        SELECT 
            pickup_location,
            dropoff_location,
            COUNT(*) as request_count
        FROM employee_app.location_preferences 
        WHERE country = ? 
        AND is_active = 1 
        AND period_end >= GETDATE()
        GROUP BY pickup_location, dropoff_location
        HAVING COUNT(*) >= 3
        ORDER BY request_count DESC
        """
        
        cursor.execute(route_combinations_query, (country,))
        route_combinations = []
        for row in cursor.fetchall():
            route_combinations.append({
                'pickup_location': row[0],
                'dropoff_location': row[1],
                'request_count': row[2]
            })
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'GET,OPTIONS'
            },
            'body': json.dumps({
                'statusCode': 200,
                'message': f'Location preferences for {country} retrieved successfully',
                'data': {
                    'country': country,
                    'pickup_locations': pickup_results,
                    'dropoff_locations': dropoff_results,
                    'time_preferences': time_results,
                    'high_demand_routes': route_combinations
                }
            }, cls=CustomJSONEncoder)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'GET,OPTIONS'
            },
            'body': json.dumps({
                'statusCode': 500,
                'message': f'Error retrieving location preferences for {country}: {str(e)}'
            })
        }









def admin_create_location_preference(event, context):
    """Handle POST /dashboard/location-preferences"""
    try:
        # Parse request body
        body = json.loads(event.get('body', '{}'))
        
        # Extract required fields
        country = body.get('country')
        pickup_location = body.get('pickup_location')
        dropoff_location = body.get('dropoff_location')
        preferred_timeframe = body.get('preferred_timeframe')
        period_start = body.get('period_start')
        period_end = body.get('period_end')
        
        # Validate required fields
        if not all([country, pickup_location, dropoff_location, preferred_timeframe, period_start, period_end]):
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
                },
                'body': json.dumps({
                    'statusCode': 400,
                    'message': 'Missing required fields: country, pickup_location, dropoff_location, preferred_timeframe, period_start, period_end'
                })
            }
        
        # Get employee_id from headers or use default (in real app, this would come from authentication)
        employee_id = event.get('headers', {}).get('employee-id', '1')
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Insert location preference
        insert_query = """
        INSERT INTO employee_app.location_preferences 
        (employee_id, country, pickup_location, dropoff_location, preferred_timeframe, period_start, period_end, created_date, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, GETDATE(), 1)
        """
        
        cursor.execute(insert_query, (employee_id, country, pickup_location, dropoff_location, preferred_timeframe, period_start, period_end))
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
            },
            'body': json.dumps({
                'statusCode': 200,
                'message': 'Location preference created successfully'
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
            },
            'body': json.dumps({
                'statusCode': 500,
                'message': f'Error creating location preference: {str(e)}'
            })
        }
