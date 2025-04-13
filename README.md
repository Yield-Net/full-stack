# DeFi Advisor - AI-Powered Crypto Investment Assistant

An intelligent DeFi assistant that helps users navigate the complex world of decentralized finance through personalized advice, strategy recommendations, and seamless transaction execution.

## ✨ Features

- **Web3 Wallet Integration**: Connect with MetaMask to access your crypto assets
- **Personalized Investment Profile**: Share your risk tolerance, investment goals, and preferences
- **AI-Generated Investment Strategies**: Receive custom DeFi strategies based on your profile
- **Real-time Market Data**: Powered by DeFi Llama API for up-to-date protocol information
- **Interactive Dashboard**: View your portfolio, recommended strategies, and investment performance
- **Conversational Interface**: Chat with the AI assistant to ask questions or execute transactions
- **Smart Contract Execution**: Implement recommended strategies directly from the app

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- Python 3.8+
- MetaMask wallet extension
- Supabase account (for database)

### Backend Setup (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys and configuration

# Start the server
uvicorn main:app --reload
```

### Frontend Setup (Next.js)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys and configuration

# Start the development server
npm run dev
```

## 🧰 Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: FastAPI, Python
- **Database**: Supabase
- **Blockchain**: Ethereum (via ethers.js, Web3.py)
- **AI/LLM Integration**: [LLM_NAME] for strategy generation and conversational interface
- **APIs**: DeFi Llama for market data, CoinGecko for pricing

## 🔄 User Flow

1. **Connect Wallet**: Sign in by connecting your MetaMask wallet
2. **Create Profile**: Complete the investor questionnaire (risk tolerance, goals, time horizon)
3. **Receive Strategies**: AI generates personalized DeFi investment strategies
4. **Explore Dashboard**: View portfolio, strategies, and market insights
5. **Chat with Assistant**: Ask questions, modify strategies, or execute transactions
6. **Implement Strategies**: Execute recommended investments directly through the platform

## 📁 Project Structure

```
/
├── backend/
│   ├── main.py             # FastAPI application entry point
│   ├── models/             # Data models and schemas
│   ├── routers/            # API routes
│   ├── services/           # Business logic and external services
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── app/                # Next.js pages and routes
│   │   ├── api/            # API route handlers
│   │   ├── dashboard/      # Dashboard page
│   │   └── page.tsx        # Landing page
│   ├── components/         # React components
│   │   ├── Chat.tsx        # AI chat interface
│   │   └── forms/          # Form components
│   ├── lib/                # Utility functions and services
│   │   ├── gemini.ts       # LLM integration
│   │   └── blockchain.ts   # Web3 interactions
│   └── package.json        # Node.js dependencies
└── README.md               # Project documentation
```

## 🛠️ Configuration

The application requires several API keys and configuration parameters:

- `SUPABASE_URL` and `SUPABASE_KEY`: For database access
- `GEMINI_API_KEY`: For AI/LLM integration
- `DEFI_LLAMA_API_KEY`: For DeFi protocol data
- `NEXT_PUBLIC_BACKEND_URL`: URL to your FastAPI backend

Set these in the appropriate `.env` files for both frontend and backend.

## 📝 Development Notes

- **Environment**: Use `.env` files for configuration (not included in repo)
- **Database**: Tables required: users, user_profiles, user_portfolio, user_strategies
- **Production Deployment**: Configure for production with:
  ```bash
  # Backend
  uvicorn main:app --host 0.0.0.0 --port 8000
  
  # Frontend
  npm run build
  npm start
  ```

## 🔒 Security Considerations

- The application never stores user private keys
- All blockchain transactions require explicit user confirmation via MetaMask
- Web3 connections use secure, encrypted communication

## 📬 Contact & Contributions

Open an issue or PR for feedback or contributions. All contributions are welcome!

## 📜 License

[LICENSE_TYPE] - See LICENSE file for details
