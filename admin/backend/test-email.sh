#!/bin/bash
echo "Testing email configuration..."
curl -X POST http://localhost:5004/api/test-email \
  -H "Content-Type: application/json" \
  -d "{}"
echo ""
echo "Email test completed. Check your email inbox!"
