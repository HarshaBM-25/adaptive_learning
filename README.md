# Adaptive Learning System

An intelligent educational platform that uses Agentic AI and RAG to provide personalized learning experiences while ensuring data privacy and compliance through Granite.

## Features

- **Adaptive Learning**: Personalized learning paths based on student needs and progress
- **RAG Integration**: Smart content retrieval and generation
- **Privacy & Compliance**: Granite integration for data protection
- **Real-time Assessment**: Dynamic assessment generation
- **Progress Tracking**: Comprehensive learning progress monitoring
- **Modern UI**: Responsive and intuitive user interface

## Prerequisites

- Python 3.8+
- Node.js 14+
- PostgreSQL 12+
- OpenAI API key
- Granite API key (for compliance)

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd adaptive_learning_system
```

### 2. Backend Setup

#### Create and activate virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### Install dependencies:
```bash
pip install -r requirements.txt
```

#### Configure environment variables:
1. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

2. Update the `.env` file with your API keys and configuration:
```plaintext
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/adaptive_learning

# JWT Configuration
JWT_SECRET_KEY=your_jwt_secret_key_here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Granite API Configuration
GRANITE_API_KEY=your_granite_api_key_here
GRANITE_API_URL=https://api.granite.ai/v1

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=True
```

#### Initialize the database:
```bash
# Create PostgreSQL database
createdb adaptive_learning

# Run migrations
alembic upgrade head
```

### 3. Frontend Setup

#### Install dependencies:
```bash
cd frontend
npm install
```

#### Configure environment variables:
1. Create a `.env` file in the frontend directory:
```bash
cp .env.example .env
```

2. Update the `.env` file with your configuration:
```plaintext
# API Configuration
REACT_APP_API_URL=http://localhost:8000

# Authentication
REACT_APP_AUTH_ENABLED=true

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_NOTIFICATIONS=true
```

## Running the Application

### Start the Backend Server
```bash
cd backend
uvicorn main:app --reload
```

### Start the Frontend Development Server
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## API Endpoints

### Authentication
- `POST /api/auth/login`: User login
- `POST /api/auth/register`: User registration

### Learning
- `POST /api/learning-path`: Get personalized learning path
- `POST /api/content`: Retrieve learning content
- `POST /api/progress`: Update learning progress
- `GET /api/privacy-policy`: Get privacy policy
- `POST /api/assessment`: Generate assessment

## Getting API Keys

### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API keys section
4. Create a new API key
5. Copy the key to your `.env` file

### Granite API Key
1. Visit [Granite AI](https://granite.ai/)
2. Sign up for an account
3. Navigate to API keys section
4. Generate a new API key
5. Copy the key to your `.env` file

## Project Structure

```
adaptive_learning_system/
├── backend/
│   ├── agents/
│   │   └── agentic_ai.py
│   │   └── retriever.py
│   │   └── compliance_middleware.py
│   │   └── models.py
│   │   └── main.py
│   │   └── config.py
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│   └── package.json
└── README.md
```

## Security & Privacy

- All API keys are stored in environment variables
- Sensitive data is encrypted
- JWT authentication for API access
- Granite integration for privacy enforcement
- Regular security audits and updates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check DATABASE_URL in .env
   - Ensure database exists

2. **API Key Issues**
   - Verify API keys are correctly set in .env
   - Check API key permissions
   - Ensure API services are accessible

3. **Frontend Connection Issues**
   - Verify backend server is running
   - Check REACT_APP_API_URL in frontend .env
   - Clear browser cache

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please:
1. Check the troubleshooting section
2. Review the documentation
3. Open an issue in the repository
4. Contact the development team 
