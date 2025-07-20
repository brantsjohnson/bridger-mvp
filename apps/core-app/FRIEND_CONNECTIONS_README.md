# Friend Connections System

This system allows users to connect with each other through QR codes and shareable links. It includes friend request management and connection handling.

## Features

- **QR Code Generation**: Each user gets a unique QR code that others can scan to send a friend request
- **Shareable Links**: Users can share a link via text/email for remote connections
- **Friend Request Management**: Accept/decline incoming friend requests
- **Connection Status Tracking**: Track pending, accepted, and declined connections

## Database Setup

### 1. Create the friend_connections table

Run the SQL script in your Supabase SQL editor:

```sql
-- Execute the contents of CREATE_FRIEND_CONNECTIONS_TABLE.sql
```

This will create:
- `friend_connections` table with proper relationships to users
- Indexes for performance
- Row Level Security (RLS) policies
- Automatic timestamp updates

### 2. Verify the table structure

The table should have these columns:
- `id` (UUID, Primary Key)
- `requester_id` (UUID, Foreign Key to users.id)
- `recipient_id` (UUID, Foreign Key to users.id)
- `status` (TEXT: 'pending', 'accepted', 'declined')
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Components

### 1. Add.tsx (QR Code & Link Generation)
- Generates unique QR codes for each user
- Creates shareable links
- Copies links to clipboard
- Displays user's name in the QR code section

### 2. ConnectionHandler.tsx (Incoming Connections)
- Handles incoming friend requests from QR codes/links
- Processes URL parameters
- Sends friend requests to the database
- Shows loading, success, and error states

### 3. FriendRequests.tsx (Request Management)
- Displays pending friend requests
- Allows accepting/declining requests
- Shows requester names and request status

### 4. friendConnections.ts (Business Logic)
- Database operations for friend connections
- QR code and link generation
- Request management functions

## Usage Flow

### For Users Sharing Their QR Code/Link:

1. Navigate to `/add`
2. QR code is automatically generated with their user info
3. Others can scan the QR code or click the shared link
4. Link copies to clipboard when "Share a link" is clicked

### For Users Receiving Friend Requests:

1. Scan QR code or click shared link
2. Navigate to `/connect` with URL parameters
3. ConnectionHandler processes the request
4. Friend request is sent to the database
5. Success/error message is shown

### For Users Managing Requests:

1. Navigate to `/friends` (or `/homies`)
2. Pending requests appear at the top
3. Click ✓ to accept or ✗ to decline
4. Request disappears after action

## URL Structure

### QR Code/Link Format:
```
https://yourdomain.com/connect?code=USER_ID_TIMESTAMP_RANDOM&user=USER_ID&name=USER_NAME
```

### Parameters:
- `code`: Unique connection code
- `user`: Requester's user ID
- `name`: Requester's name (optional)

## Authentication Integration

Currently using hardcoded user ID (`brant_user_123`) for demonstration. To integrate with auth:

1. Replace hardcoded user IDs with actual auth user ID
2. Update `App.tsx` to pass real user data to `ConnectionHandler`
3. Update `Add.tsx` to get user info from auth context
4. Update `Friends.tsx` to use authenticated user ID

## Security Features

- Row Level Security (RLS) enabled
- Users can only view their own connections
- Users can only create requests as themselves
- Users can only update connections where they are the recipient
- Unique constraint prevents duplicate connections
- Cascade delete removes connections when users are deleted

## Testing

1. **QR Code Testing**: Use a QR code scanner app to scan the generated QR code
2. **Link Testing**: Copy the shareable link and open in a new browser tab
3. **Database Testing**: Check Supabase dashboard to see friend_connections table
4. **Request Management**: Send a request and test accept/decline functionality

## Future Enhancements

- Real-time notifications for new friend requests
- Friend suggestions based on mutual connections
- Block/unblock functionality
- Connection history and activity feed
- Integration with quiz results sharing
- Push notifications for mobile apps

## Troubleshooting

### Common Issues:

1. **QR Code not working**: Check that the URL is properly formatted
2. **Database errors**: Verify RLS policies are correctly set up
3. **User not found**: Ensure the user ID exists in the users table
4. **Permission denied**: Check that the user is authenticated

### Debug Steps:

1. Check browser console for JavaScript errors
2. Check Supabase logs for database errors
3. Verify URL parameters are correctly passed
4. Test database queries directly in Supabase SQL editor 