# Multi-User System Implementation

## Overview

This implementation creates a personalized URL system for each authenticated user, allowing multiple people to use the Bridger app simultaneously while maintaining the iframe structure. Each user gets their own personalized URL like `/core/firstname_lastname` and can track their connections with other users.

## Key Features

### 1. Personalized URLs
- Each user gets a unique URL after authentication: `/core/firstname_lastname`
- URLs are based on the user's first and last name from their profile
- URLs persist across sessions and are stored in localStorage

### 2. User Tracking System
- Tracks when users access their personalized URLs
- Records QR code scans between users
- Stores connection history and analytics
- Maintains user access logs

### 3. Connection Tracking
- Tracks who scans whose QR codes
- Records friend request history
- Provides analytics on user connections
- Maintains privacy with Row Level Security (RLS)

## Database Tables

### user_tracking
- Stores personalized paths and connection codes for each user
- Links user IDs to their unique URLs
- Tracks creation and update timestamps

### user_access_logs
- Records when users access their personalized URLs
- Stores user agent and access timestamps
- Enables analytics on user engagement

### qr_code_scans
- Tracks when users scan each other's QR codes
- Records scanner and target user information
- Enables connection analytics

## Implementation Details

### Authentication Flow
1. User signs up/logs in through the auth app
2. User data is stored in localStorage
3. Personalized URL is generated: `/core/firstname_lastname`
4. User is redirected to their personalized URL
5. Tracking record is created in the database

### URL Routing
- Main app handles URL routing and iframe management
- Core app receives route changes via postMessage
- Personalized paths are preserved in the URL
- User data is passed between apps via localStorage

### User Context
- Provides user data across all components
- Manages tracking record creation
- Handles user data updates from parent window
- Maintains personalized path information

### QR Code System
- Each user gets a unique QR code for sharing
- QR codes contain connection URLs with user information
- Scanning tracks the interaction between users
- Connection requests are processed through the existing system

## Usage

### For Users
1. Sign up or log in at `/auth`
2. Get redirected to your personalized URL: `/core/yourname`
3. Share your QR code with others
4. Scan others' QR codes to connect
5. View your connections and analytics

### For Developers
1. Run the SQL scripts to create tracking tables
2. The system automatically creates tracking records for new users
3. QR code scans are automatically tracked
4. Analytics are available through the userTracking service

## Mobile Support

The system is designed to work on mobile devices:
- Responsive design for phone screens
- Camera access for QR code scanning
- Touch-friendly interface
- Mobile-optimized URL structure

## Security

- Row Level Security (RLS) ensures users can only access their own data
- User data is validated and sanitized
- Connection codes are unique and secure
- Privacy is maintained through proper data isolation

## Analytics

The system provides analytics on:
- User engagement (access logs)
- Connection patterns (QR scans)
- Friend request success rates
- User interaction frequency

## Future Enhancements

- Real-time connection notifications
- Advanced analytics dashboard
- Connection recommendations
- Social features and groups
- Enhanced privacy controls 