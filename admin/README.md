# NaviLynx Admin Dashboard

A comprehensive Next.js 14 admin dashboard for managing the NaviLynx mobile application ecosystem. This dashboard provides complete control over users, venues, deals, analytics, and all platform features with role-based access control.

![NaviLynx Logo](https://img.shields.io/badge/NaviLynx-Admin%20Dashboard-blue?style=for-the-badge)

## 🚀 Features

### Core Functionality

- **📊 Real-time Dashboard** - Monitor key metrics, system health, and recent activity
- **👥 User Management** - Manage admin users with role-based permissions
- **🏢 Venue Management** - Control shopping venues, stores, and locations
- **🏷️ Deal Management** - Create and manage promotional offers and discounts
- **📈 Analytics & Reporting** - Comprehensive analytics with performance insights
- **🔐 Role-based Access Control** - Admin, Manager, Moderator, and Viewer roles

### Design & UX

- **🎨 NaviLynx Brand Styling** - Consistent colors and design with mobile app
- **📱 Responsive Design** - Mobile-first approach with adaptive layouts
- **🌗 Dark Mode Support** - Toggle between light and dark themes
- **🔄 Collapsible Sidebar** - Space-efficient navigation with mobile support
- **⚡ Performance Optimized** - Fast loading with Next.js 14 optimizations

### Technical Features

- **🔒 Secure Authentication** - NextAuth.js integration with multiple providers
- **🗄️ Database Integration** - MongoDB with Mongoose ODM
- **🔍 Advanced Search & Filtering** - Real-time search across all data
- **📊 Data Visualization** - Interactive charts and metrics
- **🚀 Modern Tech Stack** - Next.js 14, TypeScript, Tailwind CSS

## 🛠 Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom NaviLynx theme
- **UI Components**: Custom components built on Radix UI primitives
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js
- **Icons**: Lucide React
- **Development**: ESLint, TypeScript strict mode
- **Deployment**: Vercel (production ready)

## 📁 Project Structure

```
admin/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Main dashboard
│   │   ├── users/             # User management
│   │   ├── venues/            # Venue management
│   │   ├── deals/             # Deal management
│   │   ├── analytics/         # Analytics dashboard
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable UI components
│   │   ├── ui/                # Base UI components
│   │   ├── sidebar.tsx        # Navigation sidebar
│   │   └── admin-layout.tsx   # Main layout wrapper
│   ├── lib/                   # Utility functions
│   ├── types/                 # TypeScript type definitions
│   └── hooks/                 # Custom React hooks
├── public/                    # Static assets
├── tailwind.config.ts         # Tailwind configuration
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB database (local or cloud)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/lynxsa/NaviLynx.git
   cd NaviLynx/admin
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Configure the following variables:

   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   MONGODB_URI=mongodb://localhost:27017/navilynx
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## � User Roles & Permissions

### Admin

- Full system access
- User management (create, edit, delete)
- System configuration
- All venue and deal operations
- Analytics and reporting
- Security settings

### Manager

- User management (view, edit)
- Full venue management
- Full deal management
- Analytics and reporting
- No system configuration access

### Moderator

- Limited user management (view only)
- Venue management (view, edit)
- Deal management (view, edit, create)
- Basic analytics
- Content moderation tools

### Viewer

- Read-only access to dashboards
- View analytics and reports
- No creation or editing capabilities
- Basic system monitoring

## 📊 Dashboard Features

### Main Dashboard

- **Key Metrics**: Total users, venues, deals, AR scans
- **System Status**: API health, database performance, service uptime
- **Quick Actions**: Shortcuts to common tasks
- **Recent Activity**: Live feed of platform activity

### User Management

- **User Overview**: Total, active, pending, and inactive users
- **User Profiles**: Complete user information and permissions
- **Role Management**: Assign and modify user roles
- **Activity Tracking**: Monitor user login and activity patterns

### Venue Management

- **Venue Directory**: All shopping venues and stores
- **AR Waypoints**: Manage navigation waypoints
- **Floor Plans**: Upload and manage venue layouts
- **Store Management**: Individual store information and deals

### Deal Management

- **Deal Creation**: Rich deal editor with templates
- **Performance Tracking**: Views, claims, and engagement rates
- **Scheduling**: Set deal activation and expiration dates
- **Category Management**: Organize deals by category and venue

### Analytics Dashboard

- **User Behavior**: Session duration, retention, and engagement
- **Platform Usage**: Device distribution, feature adoption
- **Performance Metrics**: Top venues, deals, and user patterns
- **Real-time Monitoring**: Live activity and system health

## 🎨 Design System

### NaviLynx Brand Colors

```css
Primary: #3B82F6   /* Blue - main brand color */
Secondary: #8B5CF6 /* Purple - secondary accent */
Accent: #06B6D4    /* Cyan - highlights */
Success: #10B981   /* Green - success states */
Warning: #F59E0B   /* Orange - warnings */
Error: #EF4444     /* Red - errors */
Dark: #1E293B      /* Dark navy */
Light: #F8FAFC     /* Light background */
```

### Components

- **Consistent Styling**: All components follow NaviLynx design language
- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Animation**: Smooth transitions and micro-interactions

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

### Code Style Guidelines

- **TypeScript**: Strict mode enabled, proper typing required
- **ESLint**: Next.js recommended rules with custom overrides
- **Prettier**: Automatic code formatting
- **File Naming**: kebab-case for files, PascalCase for components
- **Import Order**: External libraries → Internal modules → Relative imports

### Adding New Features

1. Create component in appropriate directory
2. Add TypeScript interfaces in `src/types/`
3. Implement proper error handling
4. Add responsive design considerations
5. Include accessibility features
6. Update documentation

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm run build
vercel --prod
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables (Production)

```env
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/navilynx
```

## 📝 API Integration

The admin dashboard integrates with the NaviLynx backend APIs:

- **Authentication API**: User login, logout, session management
- **User Management API**: CRUD operations for admin users
- **Venue API**: Venue data, store information, AR waypoints
- **Deal API**: Deal creation, management, and analytics
- **Analytics API**: Platform metrics, user behavior, reporting

## � Security Features

- **Authentication**: Secure login with NextAuth.js
- **Authorization**: Role-based access control (RBAC)
- **Input Validation**: Server-side validation for all inputs
- **CSRF Protection**: Built-in Next.js CSRF protection
- **Rate Limiting**: API rate limiting to prevent abuse
- **Data Encryption**: Sensitive data encryption at rest and in transit

## 🧪 Testing

```bash
npm run test          # Run unit tests
npm run test:e2e      # Run end-to-end tests
npm run test:coverage # Generate coverage report
```

## 📈 Performance

- **Bundle Size**: Optimized with Next.js automatic code splitting
- **Image Optimization**: Next.js Image component with lazy loading
- **Caching**: Redis caching for frequently accessed data
- **CDN**: Static assets served via CDN
- **Database**: Optimized MongoDB queries with indexing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Maintain 90%+ test coverage
- Use semantic commit messages
- Update documentation for new features
- Ensure responsive design compliance

## 📞 Support

- **Documentation**: [docs.navilynx.com](https://docs.navilynx.com)
- **Issues**: [GitHub Issues](https://github.com/lynxsa/NaviLynx/issues)
- **Email**: <admin@navilynx.com>
- **Discord**: [NaviLynx Community](https://discord.gg/navilynx)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Low-level UI primitives
- **Lucide** - Beautiful icon library
- **Vercel** - Deployment and hosting platform

---

**Built with ❤️ by the NaviLynx Team**

*Empowering seamless shopping experiences through innovative AR navigation and intelligent deal discovery.*
5. Submit a pull request

## 📄 License

This project is part of the NaviLynx ecosystem. All rights reserved.

## 🆘 Support

For support and questions:

- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in `/docs` (if available)

---

**NaviLynx Admin Dashboard v1.0.0** - Built with ❤️ using Next.js and TypeScript
