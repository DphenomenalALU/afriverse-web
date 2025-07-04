# Afriverse - Look Good, Waste Less

Africa's premier sustainable fashion marketplace connecting conscious shoppers with quality pre-loved pieces.

![Afriverse Logo](/public/images/afriverse-logo.png)

## About

Afriverse is a modern, sustainable fashion marketplace built with Next.js 13+, React, and Tailwind CSS. The platform aims to combat fast fashion by creating a circular economy for pre-loved clothing while supporting African communities.

### Key Features

- 👤 **User Registration & Profiles**: Create your personalized shopping profile
- 👗 **Virtual Try-On**: AR technology to visualize how clothes will look on you before buying
- 🤖 **Smart Search & AI Recommendations**: Intelligent outfit suggestions based on your style
- 💚 **Impact Tracker**: Monitor your environmental impact (CO₂ saved, items reused)
- 💬 **Chat System**: Negotiate offers and communicate with sellers directly

## Tech Stack

- **Framework**: Next.js 13+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **State Management**: React Hooks
- **Animations**: Custom animations with CSS
- **Icons**: Lucide Icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/DphenomenalALU/afriverse-web.git
cd afriverse-web
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
afriverse-website/
├── app/                   # Next.js 13 app directory
│   ├── auth/             # Authentication pages
│   ├── listings/         # Product listings
│   ├── impact/           # Impact tracking
│   └── try-on/          # AR try-on feature
├── components/           # Reusable components
│   ├── ui/              # UI components
│   └── listings/        # Listing-specific components
├── lib/                 # Utility functions
├── public/              # Static assets
└── styles/             # Global styles
```

## Features in Detail

### User Registration & Profiles
- Create and customize your shopping profile
- Track your purchase history
- Save favorite items and sellers
- Manage your listings and sales

### Virtual Try-On
- AR-powered virtual fitting room
- Try clothes on your virtual model
- Accurate size and fit visualization
- Compatible with most items

### Smart Search & AI Recommendations
- AI-powered outfit suggestions
- Style matching algorithms
- Personalized fashion recommendations
- Smart filtering and categorization

### Impact Tracker
- Track CO₂ emissions saved
- Monitor number of items reused
- View your sustainability impact
- Compare with community averages

### Chat System
- Real-time messaging with sellers
- Make and negotiate offers
- Discuss item details and conditions

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.