#!/bin/bash

API_ID="9wieil5vn5"
ROOT_ID="rgvs8th1jk"

# Essential endpoints for React app login
ENDPOINTS=(
    "get_admin_user_information:POST"
)

echo "Setting up essential API Gateway endpoints..."

for endpoint in "${ENDPOINTS[@]}"; do
    IFS=':' read -r path method <<< "$endpoint"
    echo "Creating /$path ($method)..."
    
    # Create resource
    RESOURCE_ID=$(aws apigateway create-resource \
        --profile itel \
        --region us-east-1 \
        --rest-api-id "$API_ID" \
        --parent-id "$ROOT_ID" \
        --path-part "$path" \
        --query 'id' \
        --output text 2>/dev/null)
    
    if [ "$RESOURCE_ID" != "None" ] && [ ! -z "$RESOURCE_ID" ]; then
        # Add method
        aws apigateway put-method \
            --profile itel \
            --region us-east-1 \
            --rest-api-id "$API_ID" \
            --resource-id "$RESOURCE_ID" \
            --http-method "$method" \
            --authorization-type NONE \
            --no-cli-pager > /dev/null 2>&1
        
        # Add integration
        aws apigateway put-integration \
            --profile itel \
            --region us-east-1 \
            --rest-api-id "$API_ID" \
            --resource-id "$RESOURCE_ID" \
            --http-method "$method" \
            --type AWS \
            --integration-http-method POST \
            --uri "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:679819004921:function:${path}-dev/invocations" \
            --request-templates '{"application/json":"{\"lambda_function_name\":\"'$path'\"}"}' \
            --passthrough-behavior WHEN_NO_MATCH \
            --timeout-in-millis 29000 \
            --no-cli-pager > /dev/null 2>&1
        
        # Add method response
        aws apigateway put-method-response \
            --profile itel \
            --region us-east-1 \
            --rest-api-id "$API_ID" \
            --resource-id "$RESOURCE_ID" \
            --http-method "$method" \
            --status-code 200 \
            --response-parameters '{"method.response.header.Access-Control-Allow-Origin":false}' \
            --no-cli-pager > /dev/null 2>&1
        
        # Add integration response
        aws apigateway put-integration-response \
            --profile itel \
            --region us-east-1 \
            --rest-api-id "$API_ID" \
            --resource-id "$RESOURCE_ID" \
            --http-method "$method" \
            --status-code 200 \
            --response-parameters '{"method.response.header.Access-Control-Allow-Origin":"'\''*'\''"}' \
            --no-cli-pager > /dev/null 2>&1
        
        # Add OPTIONS for CORS
        aws apigateway put-method \
            --profile itel \
            --region us-east-1 \
            --rest-api-id "$API_ID" \
            --resource-id "$RESOURCE_ID" \
            --http-method OPTIONS \
            --authorization-type NONE \
            --no-cli-pager > /dev/null 2>&1
        
        # Add Lambda permission
        aws lambda add-permission \
            --profile itel \
            --region us-east-1 \
            --function-name "${path}-dev" \
            --statement-id "apigateway-invoke-${path}-dev" \
            --action lambda:InvokeFunction \
            --principal apigateway.amazonaws.com \
            --source-arn "arn:aws:execute-api:us-east-1:679819004921:$API_ID/*/*" \
            --no-cli-pager > /dev/null 2>&1
        
        echo "✅ Created /$path"
    else
        echo "❌ Failed to create /$path"
    fi
done

# Deploy changes
aws apigateway create-deployment \
    --profile itel \
    --region us-east-1 \
    --rest-api-id "$API_ID" \
    --stage-name dev \
    --description "Essential endpoints for React login" \
    --no-cli-pager > /dev/null 2>&1

echo "🚀 Deployed changes to dev stage"
echo ""
echo "🔧 TEMPORARY SOLUTION:"
echo "The dev environment has database connection issues."
echo "For immediate testing, temporarily switch back to production:"
echo ""
echo "In HostApi.tsx, change:"
echo "const url = \"https://2z9nw7bxvh.execute-api.us-east-1.amazonaws.com/dev\";"
echo ""
echo "This will let you continue development while we debug the dev database connection."
