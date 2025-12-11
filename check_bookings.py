import boto3
import pyodbc
import pandas as pd

# Get database credentials from Secrets Manager
secrets_client = boto3.client('secretsmanager', region_name='us-east-1')

hostname = secrets_client.get_secret_value(SecretId='db_server')['SecretString']
username = secrets_client.get_secret_value(SecretId='db_user_dev')['SecretString']
password = secrets_client.get_secret_value(SecretId='db_password_dev')['SecretString']
database = secrets_client.get_secret_value(SecretId='db_name_dev')['SecretString']

connstring = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={hostname};DATABASE={database};UID={username};PWD={password}"
conn = pyodbc.connect(connstring)

# Check all bookings
print("=== ALL BOOKINGS ===")
query = "SELECT * FROM employee_app.reserve_table ORDER BY created_date DESC"
df = pd.read_sql_query(query, conn)
print(df.to_string())
print(f"\nTotal bookings: {len(df)}")

# Delete all bookings
print("\n=== DELETING ALL BOOKINGS ===")
cursor = conn.cursor()
cursor.execute("DELETE FROM employee_app.reserve_table")
conn.commit()
print(f"Deleted {cursor.rowcount} bookings")

cursor.close()
conn.close()
