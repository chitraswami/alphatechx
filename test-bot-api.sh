#!/bin/bash

echo "🤖 Testing AlphaTechX Bot Service APIs..."
echo

# Function to make authenticated requests with a mock JWT
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    # Create a simple mock JWT payload (for testing only)
    # In production, this would come from proper authentication
    local mock_user_id="test-user-123"
    
    echo "Testing: $method $endpoint"
    if [ -n "$data" ]; then
        curl -X "$method" \
            "http://localhost:4000$endpoint" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlci0xMjMiLCJpYXQiOjE2OTQwMDAwMDB9.test" \
            -d "$data" \
            -w "\nStatus: %{http_code}\n\n" \
            -s
    else
        curl -X "$method" \
            "http://localhost:4000$endpoint" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlci0xMjMiLCJpYXQiOjE2OTQwMDAwMDB9.test" \
            -w "\nStatus: %{http_code}\n\n" \
            -s
    fi
}

echo "📋 1. Testing Bot Service Health Check"
curl -s http://localhost:4000/health | jq '.' 2>/dev/null || curl -s http://localhost:4000/health
echo -e "\n"

echo "📋 2. Testing Project Creation (Get or Create)"
make_request "POST" "/api/projects/get-or-create" '{}'

echo "📋 3. Testing Trial Start"
make_request "POST" "/api/billing/start-trial" '{}'

echo "📋 4. Testing Integration URLs"
# First we need a project ID, let's use a mock one
make_request "GET" "/api/projects/test-project-id/integrations/install-urls"

echo "📋 5. Testing Document Upload (simulated)"
echo "Note: Document upload requires multipart/form-data and actual files"
echo "You can test this through the frontend interface"
echo

echo "🎯 Bot Service API Test Complete!"
echo "If you see 401 Unauthorized errors, that means the authentication is working correctly."
echo "To test with real authentication, you need to:"
echo "1. Set up the real backend authentication endpoints"
echo "2. Get a valid JWT token from login"
echo "3. Use that token in the Authorization header"
