-- Create database for bot-service if it doesn't exist
SELECT 'CREATE DATABASE bot_service' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'bot_service')\gexec

-- Grant permissions (PostgreSQL syntax)
-- Permissions are automatically granted to the postgres user