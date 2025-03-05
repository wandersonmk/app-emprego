-- Drop existing table if exists
DROP TABLE IF EXISTS services;

-- Create services table
CREATE TABLE services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    budget DECIMAL(10,2),
    location TEXT,
    category TEXT,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
    client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON services;
DROP POLICY IF EXISTS "Enable insert for clients only" ON services;
DROP POLICY IF EXISTS "Enable update for service owner" ON services;
DROP POLICY IF EXISTS "Enable delete for service owner" ON services;

-- Create policies
CREATE POLICY "Enable read access for all authenticated users"
    ON services FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for clients only"
    ON services FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = client_id AND
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND user_type = 'client'
        )
    );

CREATE POLICY "Enable update for service owner"
    ON services FOR UPDATE
    TO authenticated
    USING (auth.uid() = client_id)
    WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Enable delete for service owner"
    ON services FOR DELETE
    TO authenticated
    USING (auth.uid() = client_id);

-- Grant necessary permissions
GRANT ALL ON services TO authenticated;
GRANT ALL ON services TO service_role;
