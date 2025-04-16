# Chefio - Recipe Sharing Platform

Chefio is a modern recipe sharing platform built with Next.js, TypeScript, and Tailwind CSS. It allows users to discover, share, and save their favorite recipes.

## Features

- 🔍 Search and filter recipes
- 📱 Responsive design
- 🎨 Modern UI with beautiful animations
- 🔐 User authentication
- 💾 Save favorite recipes
- 📝 Create and share recipes

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- React Icons
- NextAuth.js

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/chefio.git
cd chefio
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
chefio/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── components/        # Reusable components
│   ├── home/              # Home page components
│   └── page.tsx           # Main page
├── public/                # Static files
│   ├── icons/            # SVG icons
│   └── images/           # Image assets
├── styles/               # CSS modules
└── types/                # TypeScript type definitions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 