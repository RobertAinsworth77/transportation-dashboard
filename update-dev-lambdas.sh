#!/bin/bash

# List of all dev Lambda functions to update
FUNCTIONS=(
    "admin_delete_driver-dev"
    "admin_edit_alert-dev"
    "admin_delete_trip-dev"
    "get_employee_info-dev"
    "get_driver_update_position-dev"
    "employee_get_trip_info-dev"
    "trsp_admin_api_user-dev"
    "admin_edit_site-dev"
    "admin_delete_bus-dev"
    "employee_cancel_booking-dev"
    "admin_get_all_drivers-dev"
    "admin_get_detailed_route-dev"
    "admin_edit_trip-dev"
    "admin_add_driver-dev"
    "get_trip_passengers-dev"
    "driver_get_future_trips-dev"
    "admin_get_busses-dev"
    "delete_driver_info-dev"
    "admin_delete_site-dev"
    "admin_edit_bus-dev"
    "admin_add_route-dev"
    "employee_get_prev_bookings-dev"
    "driver_update_position-dev"
    "admin_get_users_count-dev"
    "get_employee_login_validation-dev"
    "admin_get_alerts-dev"
    "employee_get_routes_by_site-dev"
    "admin_delete_route-dev"
    "admin_add_trip-dev"
    "get_driver_current_trip-dev"
    "admin_get_sites-dev"
    "admin_add_admin_user-dev"
    "admin_get_routes-dev"
    "admin_edit_driver-dev"
    "get_driver_information-dev"
    "admin_get_trip_by_id-dev"
    "employee_get_countries-dev"
    "admin_get_all_dashboard_users-dev"
    "employee_create_booking-dev"
    "admin_edit_route-dev"
    "admin_edit_admin_user-dev"
    "admin_search_trips-dev"
    "employee_get_current_trip-dev"
    "admin_get_trip_passengers-dev"
    "employee_get_sites-dev"
    "employee_get_trip_by_route_date-dev"
    "get_user-dev"
    "search_employee_by_hrm-dev"
    "employee_create_booking2-dev"
    "get_possible_trips-dev"
    "admin_add_site-dev"
    "driver_get_trip_info-dev"
    "admin_delete_admin_user-dev"
    "get_code_emergency-dev"
    "admin_get_trips-dev"
    "driver_get_previous_trips-dev"
    "employee_get_future_bookings-dev"
    "get_admin_user_information-dev"
    "delete_employee_info-dev"
    "admin_add_bus-dev"
    "admin_get_trips_count-dev"
)

# New container image URI
IMAGE_URI="679819004921.dkr.ecr.us-east-1.amazonaws.com/itel_lambda_image:dev"

echo "Updating dev Lambda functions with new container image..."

for func in "${FUNCTIONS[@]}"; do
    echo "Updating ${func}..."
    
    aws lambda update-function-code \
        --profile itel \
        --region us-east-1 \
        --function-name "$func" \
        --image-uri "$IMAGE_URI" \
        --no-cli-pager > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        echo "✅ Updated ${func}"
    else
        echo "❌ Failed to update ${func}"
    fi
    
    # Small delay to avoid rate limiting
    sleep 2
done

echo "Dev Lambda function updates complete!"
