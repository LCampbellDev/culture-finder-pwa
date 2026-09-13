# Culture Finder Frontend

An accessible frontend for Culture Finder, an event discovery and wishlist application.

Culture Finder helps users search for cultural events by location and category, save events to wishlists, and manage the status of saved events.

This repository contains the frontend application. It connects to the Flask API developed as part of the original Culture Finder group project.

## Project background

Culture Finder was originally developed as a group project during an intensive Python & SQL software engineering course. The original application used a Python console client, Flask API, MySQL database and the Ticketmaster Discovery API.

After completing the group project, I began developing this separate frontend to explore how the existing backend could support a more accessible, user-friendly web interface.

The frontend also gives me a space to continue developing the project independently while applying and extending my knowledge of frontend architecture, testing, accessibility and API integration.

## Current functionality

Users can:

- Create and select a demo profile
- Search for events by location
- Filter event searches by category
- View event information returned by the Culture Finder API
- Create wishlists
- View their wishlists
- Save events to a wishlist
- View events within an individual wishlist
- Update the status of a saved event

The application is still under development.

## Engineering approach

The frontend is structured to keep different responsibilities separate.

- Page clients coordinate application state and user workflows
- Reusable components handle presentation and interaction
- API modules handle communication with the Flask backend
- Shared UI components provide consistent feedback and page structure
- Tests are co-located with the code they cover

I am continuing to review the architecture as the application develops, particularly where shared helpers, validation and application logic can reduce duplication without introducing unnecessary abstraction.

## Accessibility

Accessibility is considered throughout the design and implementation rather than added after development.

The application currently includes:

- Semantic HTML and page landmarks
- Keyboard-accessible navigation and controls
- A skip link
- Visible keyboard focus states
- Accessible form labels and validation feedback
- Programmatically associated error messages
- Accessible loading, success and error feedback
- Colour combinations designed to meet WCAG AAA contrast requirements
- Responsive layouts that support zoom and different viewport sizes

Accessibility behaviour is also covered by component tests where appropriate.

## Testing

The project uses Jest and React Testing Library.

Current automated tests cover areas including:

- Component rendering and semantic structure
- Form validation and user interaction
- Accessibility behaviour
- API request and error handling
- Application state and user workflows

Further testing work is planned, including more direct unit testing of extracted logic, regression tests for identified bugs, and end-to-end testing of key user journeys.

## Technology

- Next.js
- React
- JavaScript
- CSS Modules
- Jest
- React Testing Library
- Flask API
- MySQL
- Ticketmaster Discovery API

## Running locally

The frontend requires the Culture Finder backend API to be running.

Clone the repository and install dependencies:

```bash
npm install
```

Create a `.env.local` file based on `.env.example`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000
```

Start the development server:

```bash
npm run dev
```

The frontend will then connect to the locally running Flask API.

## Quality checks

Run the automated tests:

```bash
npm test
```

Run ESLint:

```bash
npm run lint
```

Check formatting:

```bash
npm run format:check
```

Create a production build:

```bash
npm run build
```

## Development status

This is an active learning and development project.
Current work includes reviewing code readability, reducing meaningful duplication, strengthening separation of concerns, and improving test organisation.
Planned later work includes end-to-end testing, CI/CD and deployment.

## Related repositories

### Culture Finder backend

My copy of the original Flask/MySQL backend, with small changes made to support continued development and frontend integration. https://github.com/LCampbellDev/culture-finder-backend

### Original Culture Finder group project repository

The collaborative project from which this frontend developed
https://github.com/simrah89/culture-finder
