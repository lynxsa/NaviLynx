# NaviLynx Admin Dashboard - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Next.js 14 admin dashboard for the NaviLynx mobile application. The admin panel manages users, venues, deals, AR content, and analytics for the main mobile app.

## Technology Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with modern design patterns
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js
- **State Management**: React hooks and context
- **API**: Next.js API routes
- **Deployment**: Vercel (production)

## Code Style Guidelines
- Use TypeScript strict mode
- Follow Next.js 14 App Router conventions
- Use functional components with React hooks
- Implement proper error boundaries and loading states
- Use server components when possible, client components when needed
- Follow responsive design principles with mobile-first approach
- Use semantic HTML and accessibility best practices

## File Structure Conventions
```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── lib/                # Utility functions and configurations
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
├── contexts/           # React context providers
└── styles/             # Global styles and Tailwind config
```

## API Integration
- Use Next.js API routes for backend functionality
- Implement proper error handling and validation
- Use TypeScript interfaces for API responses
- Follow REST conventions for endpoints
- Implement proper authentication middleware

## Database Models
- Users (admin users, mobile app users)
- Venues (stores, malls, locations)
- Deals (promotions, discounts)
- Products (for shopping assistant)
- Analytics (usage data, performance metrics)
- AR Content (waypoints, navigation data)

## Security Considerations
- Implement role-based access control
- Validate all user inputs
- Use environment variables for secrets
- Implement rate limiting on API routes
- Follow OWASP security guidelines

## Performance Optimization
- Use Next.js built-in optimizations
- Implement proper caching strategies
- Optimize images and assets
- Use code splitting and lazy loading
- Monitor bundle size and performance metrics

## Testing Strategy
- Unit tests for utility functions
- Component testing for UI components
- Integration tests for API routes
- E2E tests for critical user flows

When generating code:
1. Always use TypeScript with proper typing
2. Implement responsive design with Tailwind CSS
3. Follow Next.js 14 best practices
4. Include proper error handling
5. Add loading states for async operations
6. Use semantic HTML and ARIA attributes
7. Implement proper form validation
8. Use modern React patterns (hooks, context)
9. Include JSDoc comments for complex functions
10. Follow the established file structure
