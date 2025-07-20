-- Create friend_connections table
CREATE TABLE IF NOT EXISTS public.friend_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    requester_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    recipient_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(requester_id, recipient_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_friend_connections_requester_id ON public.friend_connections(requester_id);
CREATE INDEX IF NOT EXISTS idx_friend_connections_recipient_id ON public.friend_connections(recipient_id);
CREATE INDEX IF NOT EXISTS idx_friend_connections_status ON public.friend_connections(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_friend_connections_updated_at 
    BEFORE UPDATE ON public.friend_connections 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.friend_connections ENABLE ROW LEVEL SECURITY;

-- Create policies for friend_connections table
-- Users can view connections where they are either the requester or recipient
CREATE POLICY "Users can view their own connections" ON public.friend_connections
    FOR SELECT USING (
        auth.uid()::text = requester_id OR auth.uid()::text = recipient_id
    );

-- Users can create friend requests
CREATE POLICY "Users can create friend requests" ON public.friend_connections
    FOR INSERT WITH CHECK (
        auth.uid()::text = requester_id
    );

-- Users can update connections where they are the recipient (to accept/decline)
CREATE POLICY "Recipients can update connections" ON public.friend_connections
    FOR UPDATE USING (
        auth.uid()::text = recipient_id
    );

-- Users can delete their own connections
CREATE POLICY "Users can delete their own connections" ON public.friend_connections
    FOR DELETE USING (
        auth.uid()::text = requester_id OR auth.uid()::text = recipient_id
    );

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.friend_connections TO authenticated; 