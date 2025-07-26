# Afriverse - Look Good, Waste Less

Africa's premier sustainable fashion marketplace connecting eco-conscious shoppers with quality pre-loved pieces.

![Afriverse Logo](/public/images/afriverse-logo.png)

## About

Afriverse is a modern, sustainable fashion marketplace built with Next.js 13+, React, and Tailwind CSS. The platform aims to combat fast fashion by creating a circular economy for pre-loved clothing while supporting African communities.

### Key Features

- 👤 **User Registration & Profiles**: Create your personalized shopping profile
- 👗 **Virtual Try-On**: AR technology to visualize how clothes will look on you before buying
- 🤖 **Smart Search & AI Recommendations**: Intelligent outfit suggestions based on your style
- 💚 **Impact Tracker**: Monitor your environmental impact (CO₂ saved, items reused)

## Tech Stack

### Core Technologies
- **Framework**: Next.js 13+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **State Management**: React Hooks
- **Animations**: Custom animations with CSS
- **Icons**: Lucide Icons

### Backend & Infrastructure
- **Database & Auth**: Supabase (PostgreSQL + Auth)
- **File Storage**: Supabase Storage
- **API**: Next.js API Routes
- **Email Service**: Resend for transactional emails

### AI & Extended Reality
- **3D Asset Generation**: TripoSR model via Replicate API
- **Virtual Try-On**: MindAR for AR visualization

### Development Tools
- **Package Manager**: pnpm
- **Code Quality**: TypeScript, ESLint
- **Formatting**: Prettier
- **Version Control**: Git
- **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone and Navigate**
   ```bash
   git clone https://github.com/DphenomenalALU/afriverse-web.git
   cd afriverse-web
   ```

2. **Install Dependencies**
   ```bash
   # Install pnpm if you haven't already
   npm install -g pnpm

   # Install project dependencies
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the example env file
   cp .env.example .env.local
   ```
   
   Then update your `.env.local` with your API keys (see Environment Variables section below).

4. **Development**
   ```bash
   pnpm dev
   ```
   Your app will be available at [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Supabase - Get these from your Supabase Dashboard (Settings > API)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Resend - Get this from your API keys dashboard (https://resend.com/api-keys)
RESEND_API_KEY=your_resend_api_key

# Replicate - Get this from your API tokens page (https://replicate.com/account/api-tokens)
REPLICATE_API_TOKEN=your_replicate_api_token
```

> **Note**: Never commit your `.env.local` file or expose these keys publicly.

### Email Configuration (Resend)

By default, the application uses `onboarding@resend.dev` as the sender email address. There are two important things to note about email sending:

1. **Without Domain Verification**: 
   - You can only send emails to the email address you used to create your Resend account
   - This is perfect for testing but not for production

2. **With Custom Domain**:
   - Add and verify your domain in the [Resend Dashboard](https://resend.com/domains)
   - Update the sender email in `lib/actions.ts` to use your verified domain
   - You can then send emails to any address

Example of updating the sender email after domain verification:
```ts
// lib/actions.ts
from: 'Afriverse <hello@yourdomain.com>', // Replace with your verified domain
```

## Project Structure

```
afriverse-website/
├── app/                  # Next.js 14 app directory with route groups
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages (login, signup)
│   ├── cart/             # Shopping cart
│   ├── checkout/         # Checkout process
│   ├── impact/           # Social impact tracking
│   ├── listings/         # Product listings and creation
│   ├── onboarding/       # User onboarding flow
│   ├── profile/          # User profile page
│   ├── search/           # Search results page
│   └── try-on/           # AR virtual try-on feature
├── components/           # Shared React components
│   ├── emails/           # Transactional email templates
│   ├── listings/         # Components specific to listings
│   └── ui/               # General-purpose UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions, actions, and libraries
│   ├── actions.ts        # Server-side actions
│   ├── supabase/         # Supabase client/server configuration
│   └── utils.ts          # General utility functions
├── public/               # Static assets (images, fonts)
└── styles/               # Global CSS styles
```


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.