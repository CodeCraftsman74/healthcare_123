# Healchar - Health Education Platform

An interactive health education platform featuring live health news, flashcards, quizzes, an AI-powered chatbot, personalized learning recommendations, and a health knowledge hub.

## Features

- **Live Health News**: Stay updated with the latest health news using NewsAPI.org
- **Flashcards & Quizzes**: Test your medical knowledge
- **AI-Powered Chatbot**: Get answers to health questions using Gemma 3 (4B) via Ollama
- **Personalized Learning**: Content tailored to your interests
- **Health Knowledge Hub**: Curated articles on medical topics
- **User Authentication**: Secure login with MongoDB session storage

## Technology Stack

- **Frontend**: React, Next.js, TailwindCSS
- **Backend**: Next.js API routes
- **Database**: MongoDB
- **AI**: Gemma 3 (4B) model via Ollama
- **News**: NewsAPI.org integration

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- MongoDB running locally
- Ollama with Gemma 3 (4B) model installed
- NewsAPI.org API key

## Setting Up Ollama with Gemma 3 (4B)

1. Install Ollama from [ollama.ai](https://ollama.ai)
2. Pull the Gemma 3 (4B) model:
   ```
   ollama pull gemma3:4b
   ```
3. Test the model (optional):
   ```
   ollama run gemma3:4b
   ```

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   cd healchar
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file with your configuration:
   ```
   MONGODB_URI=mongodb://localhost:27017/healchar
   NEWS_API_KEY=your_newsapi_org_api_key
   ```

4. Start your MongoDB server:
   ```
   mongod
   ```

5. Run the development server:
   ```
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Using the Start Services Script

We've included a helper script to start all required services:

```
chmod +x start-services.sh
./start-services.sh
```

Or use the npm script:

```
npm run start-all
```

## Project Structure

```
healchar/
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── chatbot/
│   │   │   ├── news/
│   │   │   └── ...
│   │   ├── auth/
│   │   ├── chatbot/
│   │   ├── flashcards/
│   │   ├── knowledge-hub/
│   │   ├── news/
│   │   ├── personalized/
│   │   ├── profile/
│   │   ├── quiz/
│   │   ├── globals.css
│   │   ├── layout.jsx
│   │   └── page.jsx
│   ├── components/
│   ├── context/
│   ├── lib/
│   └── models/
├── .env.local
├── next.config.js
├── package.json
├── postcss.config.js
└── tailwind.config.js
```

## Contributors

- Initial work by [Your Name]

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to trusted health information sources
- Thanks to the Next.js and TailwindCSS teams
- Gemma is a family of lightweight, state-of-the-art open models from Google
- NewsAPI.org for providing real-time news data
