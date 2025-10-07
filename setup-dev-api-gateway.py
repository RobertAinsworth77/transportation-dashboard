#!/usr/bin/env python3
"""
Script to create dev API Gateway resources and integrations
This replicates the production API Gateway structure but points to dev Lambda functions
"""

import boto3
import json
import time

# Configuration
DEV_API_ID = "9wieil5vn5"
DEV_ROOT_RESOURCE_ID = "rgvs8th1jk"
REGION = "us-east-1"
PROFILE = "itel"

# Initialize AWS clients
session = boto3.Session(profile_name=PROFILE)
apigateway = session.client('apigateway', region_name=REGION)
lambda_client = session.client('lambda', region_name=REGION)

def create_resource(parent_id, path_part):
    """Create a resource in API Gateway"""
    try:
        response = apigateway.create_resource(
            restApiId=DEV_API_ID,
            parentId=parent_id,
            pathPart=path_part
        )
        print(f"✅ Created resource: /{path_part}")
        return response['id']
    except Exception as e:
        print(f"❌ Failed to create resource /{path_part}: {e}")
        return None

def create_method(resource_id, http_method):
    """Create a method for a resource"""
    try:
        apigateway.put_method(
            restApiId=DEV_API_ID,
            resourceId=resource_id,
            httpMethod=http_method,
            authorizationType='NONE'
        )
        print(f"✅ Created method: {http_method}")
        return True
    except Exception as e:
        print(f"❌ Failed to create method {http_method}: {e}")
        return False

def create_integration(resource_id, http_method, lambda_function_name):
    """Create Lambda integration for a method"""
    try:
        lambda_arn = f"arn:aws:lambda:{REGION}:679819004921:function:{lambda_function_name}"
        
        # Create integration
        apigateway.put_integration(
            restApiId=DEV_API_ID,
            resourceId=resource_id,
            httpMethod=http_method,
            type='AWS',
            integrationHttpMethod='POST',
            uri=f"arn:aws:apigateway:{REGION}:lambda:path/2015-03-31/functions/{lambda_arn}/invocations",
            requestTemplates={
                'application/json': json.dumps({
                    "lambda_function_name": lambda_function_name.replace('-dev', '')
                })
            },
            passthroughBehavior='WHEN_NO_MATCH',
            timeoutInMillis=29000
        )
        
        # Create method response
        apigateway.put_method_response(
            restApiId=DEV_API_ID,
            resourceId=resource_id,
            httpMethod=http_method,
            statusCode='200',
            responseParameters={
                'method.response.header.Access-Control-Allow-Origin': False
            }
        )
        
        # Create integration response
        apigateway.put_integration_response(
            restApiId=DEV_API_ID,
            resourceId=resource_id,
            httpMethod=http_method,
            statusCode='200',
            responseParameters={
                'method.response.header.Access-Control-Allow-Origin': "'*'"
            }
        )
        
        print(f"✅ Created integration for {lambda_function_name}")
        return True
    except Exception as e:
        print(f"❌ Failed to create integration for {lambda_function_name}: {e}")
        return False

def add_lambda_permission(lambda_function_name, source_arn):
    """Add permission for API Gateway to invoke Lambda"""
    try:
        lambda_client.add_permission(
            FunctionName=lambda_function_name,
            StatementId=f"apigateway-invoke-{lambda_function_name}",
            Action='lambda:InvokeFunction',
            Principal='apigateway.amazonaws.com',
            SourceArn=source_arn
        )
        print(f"✅ Added permission for {lambda_function_name}")
        return True
    except Exception as e:
        if "ResourceConflictException" in str(e):
            print(f"⚠️  Permission already exists for {lambda_function_name}")
            return True
        print(f"❌ Failed to add permission for {lambda_function_name}: {e}")
        return False

# Key API Gateway resources to create (simplified version for testing)
key_resources = [
    {
        'path': 'dashboard',
        'parent': DEV_ROOT_RESOURCE_ID,
        'children': [
            {
                'path': 'version',
                'methods': [
                    {'http_method': 'GET', 'lambda': 'admin_get_version-dev'}
                ]
            }
        ]
    }
]

def main():
    print("Setting up dev API Gateway resources...")
    
    # Create dashboard resource
    dashboard_id = create_resource(DEV_ROOT_RESOURCE_ID, 'dashboard')
    if not dashboard_id:
        return
    
    # Create version resource under dashboard
    version_id = create_resource(dashboard_id, 'version')
    if not version_id:
        return
    
    # Create GET method for version
    if create_method(version_id, 'GET'):
        # Create integration
        if create_integration(version_id, 'GET', 'admin_get_version-dev'):
            # Add Lambda permission
            source_arn = f"arn:aws:execute-api:{REGION}:679819004921:{DEV_API_ID}/*/*"
            add_lambda_permission('admin_get_version-dev', source_arn)
    
    print("\nDev API Gateway basic setup complete!")
    print(f"API Gateway ID: {DEV_API_ID}")
    print(f"Test URL: https://{DEV_API_ID}.execute-api.{REGION}.amazonaws.com/dev/dashboard/version")
    print("\nNext steps:")
    print("1. Deploy the API Gateway")
    print("2. Test the endpoint")
    print("3. Create remaining resources")

if __name__ == "__main__":
    main()
