-- Create user tracking table
CREATE TABLE IF NOT EXISTS user_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  personalized_path TEXT NOT NULL UNIQUE,
  connection_code TEXT NOT NULL UNIQUE,
  connection_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user access logs table
CREATE TABLE IF NOT EXISTS user_access_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  personalized_path TEXT NOT NULL,
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create QR code scans table
CREATE TABLE IF NOT EXISTS qr_code_scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scanner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scanner_name TEXT NOT NULL,
  target_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_name TEXT NOT NULL,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_tracking_user_id ON user_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tracking_personalized_path ON user_tracking(personalized_path);
CREATE INDEX IF NOT EXISTS idx_user_access_logs_user_id ON user_access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_access_logs_accessed_at ON user_access_logs(accessed_at);
CREATE INDEX IF NOT EXISTS idx_qr_code_scans_scanner_user_id ON qr_code_scans(scanner_user_id);
CREATE INDEX IF NOT EXISTS idx_qr_code_scans_target_user_id ON qr_code_scans(target_user_id);
CREATE INDEX IF NOT EXISTS idx_qr_code_scans_scanned_at ON qr_code_scans(scanned_at);

-- Enable Row Level Security (RLS)
ALTER TABLE user_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_code_scans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_tracking
CREATE POLICY "Users can view their own tracking data" ON user_tracking
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tracking data" ON user_tracking
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tracking data" ON user_tracking
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for user_access_logs
CREATE POLICY "Users can view their own access logs" ON user_access_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own access logs" ON user_access_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for qr_code_scans
CREATE POLICY "Users can view scans they were involved in" ON qr_code_scans
  FOR SELECT USING (auth.uid() = scanner_user_id OR auth.uid() = target_user_id);

CREATE POLICY "Users can insert scans they were involved in" ON qr_code_scans
  FOR INSERT WITH CHECK (auth.uid() = scanner_user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for user_tracking table
CREATE TRIGGER update_user_tracking_updated_at
  BEFORE UPDATE ON user_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 