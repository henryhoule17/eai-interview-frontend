# Endeavor Interview Project - Frontend

This is the frontend service for the PDF extraction and matching application. It's built with Next.js, TypeScript, and Tailwind CSS.

## Prerequisites

- Node.js 20+
- npm or yarn
- Docker (optional)

## Local Development Setup

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

2. Set up environment variables:
   Create a `.env.local` file with:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000)

## Docker Setup

1. Build the container:
   ```bash
   docker build -t endeavor-frontend .
   ```

2. Run the container:
   ```bash
   docker run -d \
     --name endeavor-web \
     -p 3000:3000 \
     -e NEXT_PUBLIC_BACKEND_URL=http://localhost:8000 \
     endeavor-frontend
   ```

## Features

### 1. PDF Extraction
- Upload PDF files
- Extract item details automatically
- View extracted data in a structured format

### 2. Item Matching
- Automatic matching with database items
- Match score visualization
- Manual match selection
- Best match auto-selection

### 3. Order Finalization
- Edit customer information
- Modify item details
- Review order summary
- Submit final order

## Project Structure

```
/app
  /components
    Extract.tsx    # PDF upload and extraction
    Match.tsx      # Item matching interface
    Finalize.tsx   # Order finalization form
  page.tsx         # Main application page
  layout.tsx       # Root layout
/styles
  globals.css      # Global styles and Tailwind
```

## Development

### Build
```bash
npm run build
# or
yarn build
```

### Type Checking
```bash
npm run type-check
# or
yarn type-check
```

### Linting
```bash
npm run lint
# or
yarn lint
```

## Dependencies

- Next.js 14
- React 18
- TypeScript 5
- Tailwind CSS
- Axios for API requests

## Notes

- The application expects a backend service running at `NEXT_PUBLIC_BACKEND_URL`
- File uploads are limited to PDF format
- The UI is optimized for desktop viewing
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
