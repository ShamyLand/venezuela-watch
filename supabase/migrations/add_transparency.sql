-- Add transparency_json column to analyses table if it doesn't exist
ALTER TABLE analyses 
ADD COLUMN IF NOT EXISTS transparency_json JSONB;

-- Create a table to track sources (Optional but good for administrative view)
CREATE TABLE IF NOT EXISTS sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    url TEXT UNIQUE NOT NULL,
    category TEXT,
    reliability_score INTEGER,
    language TEXT,
    last_fetched_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Policy for sources (assuming public read, authenticated insert/update)
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON sources FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON sources FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');
