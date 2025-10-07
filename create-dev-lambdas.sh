#!/bin/bash

# List of all transportation Lambda functions to create dev versions for
FUNCTIONS=(
    "admin_delete_driver"
    "admin_edit_alert"
    "admin_delete_trip"
    "get_employee_info"
    "get_driver_update_position"
    "employee_get_trip_info"
    "trsp_admin_api_user"
    "admin_edit_site"
    "admin_delete_bus"
    "employee_cancel_booking"
    "admin_get_detailed_route"
    "admin_edit_trip"
    "admin_add_driver"
    "get_trip_passengers"
    "driver_get_future_trips"
    "admin_get_busses"
    "delete_driver_info"
    "admin_delete_site"
    "admin_edit_bus"
    "admin_add_route"
    "employee_get_prev_bookings"
    "driver_update_position"
    "admin_get_users_count"
    "get_employee_login_validation"
    "admin_get_alerts"
    "employee_get_routes_by_site"
    "admin_delete_route"
    "admin_add_trip"
    "get_driver_current_trip"
    "admin_get_sites"
    "admin_add_admin_user"
    "admin_get_routes"
    "admin_edit_driver"
    "get_driver_information"
    "admin_get_trip_by_id"
    "employee_get_countries"
    "admin_get_all_dashboard_users"
    "employee_create_booking"
    "admin_edit_route"
    "admin_edit_admin_user"
    "admin_search_trips"
    "employee_get_current_trip"
    "admin_get_trip_passengers"
    "employee_get_sites"
    "employee_get_trip_by_route_date"
    "get_user"
    "search_employee_by_hrm"
    "employee_create_booking2"
    "get_possible_trips"
    "admin_add_site"
    "driver_get_trip_info"
    "admin_delete_admin_user"
    "get_code_emergency"
    "admin_get_trips"
    "driver_get_previous_trips"
    "employee_get_future_bookings"
    "get_admin_user_information"
    "delete_employee_info"
    "admin_add_bus"
    "admin_get_trips_count"
)

# ECR image URI
IMAGE_URI="679819004921.dkr.ecr.us-east-1.amazonaws.com/itel_lambda_image@sha256:fcfd0ea09c2237abd28c97269c7d528321cd9ad6467dec4efcf98bd14eeda525"

echo "Creating dev Lambda functions..."

for func in "${FUNCTIONS[@]}"; do
    echo "Creating ${func}-dev..."
    
    # Get the original function's role
    ROLE=$(aws lambda get-function-configuration --profile itel --region us-east-1 --function-name "$func" --query 'Role' --output text 2>/dev/null)
    
    if [ "$ROLE" != "None" ] && [ ! -z "$ROLE" ]; then
        aws lambda create-function \
            --profile itel \
            --region us-east-1 \
            --function-name "${func}-dev" \
            --package-type Image \
            --code ImageUri="$IMAGE_URI" \
            --role "$ROLE" \
            --timeout 30 \
            --environment Variables='{ENV=dev}' \
            --no-cli-pager > /dev/null 2>&1
        
        if [ $? -eq 0 ]; then
            echo "✅ Created ${func}-dev"
        else
            echo "❌ Failed to create ${func}-dev"
        fi
    else
        echo "⚠️  Skipping ${func} - could not get role"
    fi
    
    # Small delay to avoid rate limiting
    sleep 1
done

echo "Dev Lambda function creation complete!"
