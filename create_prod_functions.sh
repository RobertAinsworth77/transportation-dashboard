#!/bin/bash

# Production Lambda Functions Creation Script
# Creates new -prod versions of all functions from the prod image

set -e

# Configuration
ECR_IMAGE="679819004921.dkr.ecr.us-east-1.amazonaws.com/itel_lambda_image:prod"
REGION="us-east-1"
ROLE_ARN="arn:aws:iam::679819004921:role/service-role/admin_delete_driver-role-7u8j0i9c"

# Function list (94 unique functions)
FUNCTIONS=(
    "add_passenger_to_trip"
    "admin_add_admin_user"
    "admin_add_bus"
    "admin_add_driver"
    "admin_add_route"
    "admin_add_site"
    "admin_add_trip"
    "admin_add_trips"
    "admin_clear_bookings"
    "admin_create_location_preference"
    "admin_create_route_alignment"
    "admin_delete_admin_user"
    "admin_delete_bus"
    "admin_delete_driver"
    "admin_delete_route"
    "admin_delete_route_alignment"
    "admin_delete_site"
    "admin_delete_trip"
    "admin_edit_admin_user"
    "admin_edit_alert"
    "admin_edit_bus"
    "admin_edit_driver"
    "admin_edit_route"
    "admin_edit_site"
    "admin_edit_trip"
    "admin_get_alerts"
    "admin_get_all_dashboard_users"
    "admin_get_all_drivers"
    "admin_get_busses"
    "admin_get_detailed_route"
    "admin_get_location_preferences_by_country"
    "admin_get_location_preferences_summary"
    "admin_get_route_alignment_filters"
    "admin_get_route_alignments"
    "admin_get_routes"
    "admin_get_sites"
    "admin_get_trip_by_id"
    "admin_get_trip_passengers"
    "admin_get_trips"
    "admin_get_trips_count"
    "admin_get_users_count"
    "admin_get_version"
    "admin_search_trips"
    "admin_update_route_alignment"
    "call_emergency"
    "cancel_pending_bookings"
    "check_passenger_reserve"
    "check_passenger_reserve_v2"
    "cognito_pre_signup"
    "create_driver"
    "create_employee"
    "delete_driver_info"
    "delete_employee_info"
    "driver_get_future_trips"
    "driver_get_previous_trips"
    "driver_get_trip_info"
    "driver_update_position"
    "employee_cancel_booking"
    "employee_create_booking"
    "employee_create_booking2"
    "employee_get_countries"
    "employee_get_current_trip"
    "employee_get_future_bookings"
    "employee_get_info"
    "employee_get_initial_data"
    "employee_get_prev_bookings"
    "employee_get_routes_by_site"
    "employee_get_sites"
    "employee_get_stops_by_city"
    "employee_get_trip_by_route_date"
    "employee_get_trip_info"
    "end_trip"
    "get_admin_user_information"
    "get_code_emergency"
    "get_driver_current_trip"
    "get_driver_information"
    "get_driver_update_position"
    "get_employee_info"
    "get_employee_login_validation"
    "get_possible_trips"
    "get_prev_trip"
    "get_trip_passengers"
    "get_user_information"
    "move_employee_between_trips"
    "new_api_sites"
    "pre_signup_validations"
    "search_employee_by_hrm"
    "search_multiple_employees_by_hrm"
    "start_trip"
    "test_new_form_image"
)

echo "Creating ${#FUNCTIONS[@]} production Lambda functions..."
echo "Using image: $ECR_IMAGE"
echo ""

# Counter for progress
count=0
total=${#FUNCTIONS[@]}

for func in "${FUNCTIONS[@]}"; do
    count=$((count + 1))
    prod_func_name="${func}-prod"
    
    echo "[$count/$total] Creating $prod_func_name..."
    
    # Check if function already exists
    if aws lambda get-function --function-name "$prod_func_name" --region "$REGION" >/dev/null 2>&1; then
        echo "  Function $prod_func_name already exists, skipping..."
        continue
    fi
    
    # Create the Lambda function
    aws lambda create-function \
        --function-name "$prod_func_name" \
        --role "$ROLE_ARN" \
        --code ImageUri="$ECR_IMAGE" \
        --package-type Image \
        --timeout 30 \
        --memory-size 512 \
        --environment Variables="{ENV=prod}" \
        --region "$REGION" \
        --image-config EntryPoint="[\"app.handler\"]" \
        >/dev/null
    
    if [ $? -eq 0 ]; then
        echo "  ✓ Created $prod_func_name"
    else
        echo "  ✗ Failed to create $prod_func_name"
    fi
done

echo ""
echo "Production Lambda functions creation completed!"
echo "Created ${#FUNCTIONS[@]} functions with -prod suffix"
echo ""
echo "Next steps:"
echo "1. Update API Gateway routes to point to new -prod functions"
echo "2. Test the new functions"
echo "3. Update IAM roles for Secrets Manager access"
