#!/bin/bash

# List of all dev Lambda functions to update
FUNCTIONS=(
    "admin_delete_driver-dev-serialization-fix"
    "admin_edit_alert-dev-serialization-fix"
    "admin_delete_trip-dev-serialization-fix"
    "get_employee_info-dev-serialization-fix"
    "get_driver_update_position-dev-serialization-fix"
    "employee_get_trip_info-dev-serialization-fix"
    "trsp_admin_api_user-dev-serialization-fix"
    "admin_edit_site-dev-serialization-fix"
    "admin_delete_bus-dev-serialization-fix"
    "employee_cancel_booking-dev-serialization-fix"
    "admin_get_all_drivers-dev-serialization-fix"
    "admin_get_detailed_route-dev-serialization-fix"
    "admin_edit_trip-dev-serialization-fix"
    "admin_add_driver-dev-serialization-fix"
    "get_trip_passengers-dev-serialization-fix"
    "driver_get_future_trips-dev-serialization-fix"
    "admin_get_busses-dev-serialization-fix"
    "delete_driver_info-dev-serialization-fix"
    "admin_delete_site-dev-serialization-fix"
    "admin_edit_bus-dev-serialization-fix"
    "admin_add_route-dev-serialization-fix"
    "employee_get_prev_bookings-dev-serialization-fix"
    "driver_update_position-dev-serialization-fix"
    "admin_get_users_count-dev-serialization-fix"
    "get_employee_login_validation-dev-serialization-fix"
    "admin_get_alerts-dev-serialization-fix"
    "employee_get_routes_by_site-dev-serialization-fix"
    "admin_delete_route-dev-serialization-fix"
    "admin_add_trip-dev-serialization-fix"
    "get_driver_current_trip-dev-serialization-fix"
    "admin_get_sites-dev-serialization-fix"
    "admin_add_admin_user-dev-serialization-fix"
    "admin_get_routes-dev-serialization-fix"
    "admin_edit_driver-dev-serialization-fix"
    "get_driver_information-dev-serialization-fix"
    "admin_get_trip_by_id-dev-serialization-fix"
    "employee_get_countries-dev-serialization-fix"
    "admin_get_all_dashboard_users-dev-serialization-fix"
    "employee_create_booking-dev-serialization-fix"
    "admin_edit_route-dev-serialization-fix"
    "admin_edit_admin_user-dev-serialization-fix"
    "admin_search_trips-dev-serialization-fix"
    "employee_get_current_trip-dev-serialization-fix"
    "admin_get_trip_passengers-dev-serialization-fix"
    "employee_get_sites-dev-serialization-fix"
    "employee_get_trip_by_route_date-dev-serialization-fix"
    "get_user-dev-serialization-fix"
    "search_employee_by_hrm-dev-serialization-fix"
    "employee_create_booking2-dev-serialization-fix"
    "get_possible_trips-dev-serialization-fix"
    "admin_add_site-dev-serialization-fix"
    "driver_get_trip_info-dev-serialization-fix"
    "admin_delete_admin_user-dev-serialization-fix"
    "get_code_emergency-dev-serialization-fix"
    "admin_get_trips-dev-serialization-fix"
    "driver_get_previous_trips-dev-serialization-fix"
    "employee_get_future_bookings-dev-serialization-fix"
    "get_admin_user_information-dev-serialization-fix"
    "delete_employee_info-dev-serialization-fix"
    "admin_add_bus-dev-serialization-fix"
    "admin_get_trips_count-dev-serialization-fix"
)

# New container image URI
IMAGE_URI="679819004921.dkr.ecr.us-east-1.amazonaws.com/itel_lambda_image:dev-serialization-fix"

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
