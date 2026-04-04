# Event Registration Platform

A modern, multilingual event management and registration platform built with React, TypeScript, and Supabase.

## Features

### For Event Organizers (Admins)
- **Event Creation & Management**: Create events with titles, descriptions, dates, locations, and custom poster images
- **Custom Registration Forms**: Build dynamic registration forms with custom fields (text, email, phone, date, select)
- **Registration Tracking**: View and manage all registrations for your events
- **Event Status Control**: Set events as active, draft, or closed
- **Secure Authentication**: Admin dashboard protected with Supabase authentication

### For Attendees
- **Browse Events**: View all active events with posters and details
- **Easy Registration**: Register for events through custom forms
- **Multilingual Support**: Available in English and Swahili (Kiswahili)
- **Mobile Responsive**: Works seamlessly on all devices

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for event posters)
- **Internationalization**: i18next + react-i18next
- **Icons**: Lucide React

## Database Schema

### Tables
- **events**: Stores event information (title, description, dates, location, poster)
- **event_fields**: Custom form fields for each event
- **registrations**: User registration data and responses

### Security
- Row Level Security (RLS) enabled on all tables
- Authenticated users can manage their own events
- Public users can view active events and register

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (`.env`):
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

### Deployment

Build for production:
```bash
npm run build
```

## Usage

### Admin Dashboard
1. Navigate to `/` and login with your credentials
2. Create new events with custom fields
3. Upload event posters
4. View and manage registrations

### Public Event Pages
- Events are accessible at: `/event/{event-slug}`
- Users can register without authentication
- Forms adapt based on custom fields defined by organizers

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License