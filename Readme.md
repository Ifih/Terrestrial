# Terrestrial - AI-Powered Land Degradation Monitoring Platform

A comprehensive full-stack application that leverages artificial intelligence, machine learning, and satellite imagery analysis to monitor, predict, and mitigate land degradation. Built with Next.js 15, Supabase, and advanced AI models.

**Live Demo:** **https://terrestrial.vercel.app/**

![Terrestrial Platform](public/placeholder-logo.svg)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Components Documentation](#components-documentation)
- [API Routes](#api-routes)
- [Machine Learning Models](#machine-learning-models)
- [Setup Instructions](#setup-instructions)
- [Usage Guide](#usage-guide)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)

---

## Overview

Terrestrial is an advanced environmental monitoring platform that combines multiple AI technologies to analyze satellite imagery, detect land degradation patterns, and provide actionable insights for sustainable land management. The platform supports multi-user access with role-based permissions and real-time data processing.

### Key Capabilities

- **Satellite Image Analysis**: Upload and analyze RGB, multispectral, and infrared satellite imagery
- **AI-Powered Detection**: Four distinct AI models for comprehensive land degradation assessment
- **Climate Predictions**: Forecast land degradation scenarios under various climate conditions
- **Expert Chat Assistant**: Natural language interface for environmental science consultation
- **Real-time Monitoring**: Track degradation trends across multiple locations and time periods

---

## Features

### 1. Multi-Model AI Analysis

- **Classical Machine Learning** (scikit-learn)
  - Random Forest Classifier for degradation level prediction
  - Random Forest Regressor for vegetation loss estimation
  - Feature importance analysis for environmental factors

- **Deep Learning CNNs** (PyTorch)
  - Erosion detection with confidence scoring
  - Vegetation loss analysis with spatial mapping
  - Transfer learning from pre-trained models

- **Segmentation Models** (Gemini 2.5)
  - Satellite imagery segmentation
  - Land cover classification
  - Change detection over time

- **LLM Integration** (Gemini 2.5)
  - Natural language explanations of analysis results
  - Expert recommendations for land restoration
  - Interactive chat interface for environmental queries

### 2. User Management

- Secure authentication with Supabase Auth
- Role-based access control (User, Admin, Researcher)
- Organization-based user grouping
- Profile management with custom metadata

### 3. Data Visualization

- Interactive charts with Recharts
- Degradation level distribution analysis
- Time-series trend visualization
- Geographic mapping of analyzed locations

### 4. Climate Scenario Predictions

- Multiple climate scenarios (Current Trends, Moderate Warming, High Warming, Drought Stress, Extreme Weather)
- Year-range predictions (2030-2100)
- Risk assessment with actionable recommendations
- Historical prediction tracking

---

## Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + shadcn/ui
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Hooks + SWR

### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **AI/ML**: Vercel AI SDK v5

### AI/ML Stack
- **Classical ML**: scikit-learn (Python)
- **Deep Learning**: PyTorch
- **LLM**: Gemini 2.5 (via AI SDK)
- **Image Processing**: PIL/Pillow, NumPy

### Infrastructure
- **Hosting**: Vercel
- **Database**: Supabase (PostgreSQL)
- **CDN**: Vercel Edge Network
- **Analytics**: Vercel Analytics

---

## Architecture

### System Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                     Client (Browser)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Dashboard  │  │  Image Upload│  │  AI Chat     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Next.js App Router                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  API Routes  │  │  Middleware  │  │  Server      │      │
│  │              │  │  (Auth)      │  │  Components  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Supabase   │  │  AI Models   │  │  Vercel AI   │
│   Database   │  │  (Python)    │  │     SDK      │
│              │  │              │  │              │
│ - PostgreSQL │  │ - Classical  │  │ - Gemini 2.5 │
│ - Auth       │  │ - CNN        │  │ - Streaming  │
│ - Storage    │  │ - PyTorch    │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
\`\`\`

### Data Flow

1. **Image Upload Flow**
   \`\`\`
   User → Upload Form → API Route → Supabase Storage → Database Record
   \`\`\`

2. **Analysis Flow**
   \`\`\`
   Image → Analysis API → Python ML Models → Results → Database → UI Update
   \`\`\`

3. **Chat Flow**
   \`\`\`
   User Message → Chat API → Gemini LLM → Streaming Response → UI Display
   \`\`\`

---

## Database Schema

### Tables

#### `profiles`
User profile information and metadata.

\`\`\`sql
- id: UUID (Primary Key, references auth.users)
- email: TEXT
- full_name: TEXT
- role: TEXT (user, admin, researcher)
- organization: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
\`\`\`

#### `satellite_images`
Uploaded satellite imagery metadata.

\`\`\`sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key → auth.users)
- image_url: TEXT
- location_name: TEXT
- latitude: DECIMAL(10, 8)
- longitude: DECIMAL(11, 8)
- capture_date: DATE
- image_type: TEXT (rgb, multispectral, infrared)
- uploaded_at: TIMESTAMP
\`\`\`

#### `analysis_results`
ML/DL model prediction results.

\`\`\`sql
- id: UUID (Primary Key)
- image_id: UUID (Foreign Key → satellite_images)
- user_id: UUID (Foreign Key → auth.users)
- model_type: TEXT (classical_ml, cnn_erosion, cnn_vegetation, segmentation)
- prediction_data: JSONB
- confidence_score: DECIMAL(5, 4)
- degradation_level: TEXT (none, low, moderate, high, severe)
- erosion_detected: BOOLEAN
- vegetation_loss_percentage: DECIMAL(5, 2)
- analyzed_at: TIMESTAMP
\`\`\`

#### `chat_sessions`
LLM conversation sessions.

\`\`\`sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key → auth.users)
- title: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
\`\`\`

#### `chat_messages`
Individual chat messages.

\`\`\`sql
- id: UUID (Primary Key)
- session_id: UUID (Foreign Key → chat_sessions)
- user_id: UUID (Foreign Key → auth.users)
- role: TEXT (user, assistant, system)
- content: TEXT
- created_at: TIMESTAMP
\`\`\`

#### `predictions`
Climate scenario predictions.

\`\`\`sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key → auth.users)
- location_name: TEXT
- latitude: DECIMAL(10, 8)
- longitude: DECIMAL(11, 8)
- climate_scenario: TEXT
- prediction_data: JSONB
- risk_level: TEXT (low, medium, high, critical)
- predicted_for_year: INTEGER
- created_at: TIMESTAMP
\`\`\`

### Row Level Security (RLS)

All tables implement RLS policies ensuring users can only access their own data:
- Users can SELECT, INSERT, UPDATE, DELETE their own records
- Admin users have elevated permissions (configured separately)

---

## Components Documentation

### Page Components

#### `app/page.tsx` - Landing Page
**Purpose**: Marketing homepage showcasing platform features and capabilities.

**Features**:
- Hero section with call-to-action
- Feature cards (AI Models, Python Analysis, Predictions)
- "How It Works" section with step-by-step guide
- Technology stack showcase
- Footer with navigation links

**Key Elements**:
- Responsive design with mobile-first approach
- Gradient accents and earth-toned color scheme
- Direct links to authentication and dashboard

#### `app/dashboard/page.tsx` - Main Dashboard
**Purpose**: Central hub for authenticated users to access all platform features.

**Components Used**:
- `StatsOverview`: Displays total images and analyses
- `DegradationChart`: Visualizes degradation level distribution
- `RecentAnalyses`: Shows recent satellite image analyses

**Features**:
- Quick action cards for Upload, Chat, and Predictions
- Real-time statistics fetching from Supabase
- Protected route (requires authentication)

#### `app/analysis/[imageId]/page.tsx` - Analysis Detail Page
**Purpose**: Detailed view of a specific satellite image analysis.

**Components Used**:
- `AnalysisCard`: Displays individual model results
- `RunAnalysisButton`: Triggers AI model execution

**Features**:
- Image display with metadata
- Four analysis cards (Classical ML, CNN Erosion, CNN Vegetation, Segmentation)
- Sequential model execution with progress tracking
- Real-time result updates

#### `app/chat/page.tsx` - AI Chat Interface
**Purpose**: Interactive chat with AI assistant for land degradation expertise.

**Components Used**:
- `ChatInterface`: Main chat component with message history

**Features**:
- Streaming responses from Gemini LLM
- Message persistence to database
- Example questions for user guidance
- Real-time typing indicators

#### `app/predictions/page.tsx` - Climate Predictions
**Purpose**: Generate and view climate scenario predictions.

**Components Used**:
- `PredictionForm`: Input form for prediction parameters

**Features**:
- Multiple climate scenarios
- Year-range selection (2030-2100)
- Risk assessment visualization
- Historical predictions list

#### `app/auth/login/page.tsx` - Login Page
**Purpose**: User authentication interface.

**Features**:
- Email/password authentication
- Form validation with Zod
- Error handling and display
- Redirect to dashboard on success

#### `app/auth/sign-up/page.tsx` - Registration Page
**Purpose**: New user registration.

**Features**:
- Email/password signup
- Automatic profile creation
- Email verification flow
- Redirect to success page

### Custom Components

#### `components/image-upload-form.tsx`
**Purpose**: Form for uploading satellite imagery with metadata.

**Functionality**:
- File upload with drag-and-drop support
- Metadata capture (location, coordinates, date, type)
- Form validation with React Hook Form + Zod
- Image preview before upload
- API integration for storage

**Props**: None (self-contained)

**State Management**:
- Form state via `useForm`
- Upload progress tracking
- Success/error notifications

#### `components/analysis-card.tsx`
**Purpose**: Display individual AI model analysis results.

**Props**:
\`\`\`typescript
{
  title: string          // Model name
  type: string          // Model type identifier
  result: {             // Analysis results
    degradation_level?: string
    confidence_score?: number
    vegetation_loss_percentage?: number
    erosion_detected?: boolean
    prediction_data?: any
  } | null
}
\`\`\`

**Features**:
- Conditional rendering based on result availability
- Progress bars for confidence scores
- Badge indicators for degradation levels
- Formatted metric display

#### `components/run-analysis-button.tsx`
**Purpose**: Trigger AI model execution for a satellite image.

**Props**:
\`\`\`typescript
{
  imageId: string       // UUID of satellite image
  imageUrl: string      // URL of image for processing
}
\`\`\`

**Functionality**:
- Sequential execution of all four AI models
- Progress tracking with visual feedback
- Error handling for failed analyses
- Database result storage
- UI state updates on completion

#### `components/chat-interface.tsx`
**Purpose**: Interactive chat UI with streaming AI responses.

**Functionality**:
- Message input with form validation
- Real-time streaming response display
- Message history with role-based styling
- Auto-scroll to latest message
- Session management

**Hooks Used**:
- `useChat` from AI SDK for streaming
- `useEffect` for scroll management
- `useState` for local state

#### `components/prediction-form.tsx`
**Purpose**: Form for generating climate scenario predictions.

**Props**:
\`\`\`typescript
{
  onPredictionCreated?: () => void  // Callback after successful prediction
}
\`\`\`

**Features**:
- Location input with coordinates
- Climate scenario selection
- Year range picker
- Form validation
- API integration for prediction generation

#### `components/stats-overview.tsx`
**Purpose**: Display summary statistics on dashboard.

**Props**:
\`\`\`typescript
{
  totalImages: number
  totalAnalyses: number
}
\`\`\`

**Features**:
- Card-based layout
- Icon indicators
- Responsive grid

#### `components/degradation-chart.tsx`
**Purpose**: Visualize degradation level distribution.

**Props**:
\`\`\`typescript
{
  analyses: Array<{
    degradation_level: string
    model_type: string
  }>
}
\`\`\`

**Features**:
- Bar chart with Recharts
- Color-coded degradation levels
- Responsive sizing
- Tooltip on hover

#### `components/recent-analyses.tsx`
**Purpose**: Display grid of recent satellite image analyses.

**Functionality**:
- Fetches recent analyses from Supabase
- Image thumbnails with metadata
- Degradation level badges
- Click-through to detail pages

---

## API Routes

### Authentication Routes

#### `POST /api/auth/login`
Handled by Supabase Auth (via `app/auth/login/page.tsx`)

#### `POST /api/auth/sign-up`
Handled by Supabase Auth (via `app/auth/sign-up/page.tsx`)

### Image Management Routes

#### `POST /api/upload-image`
**Purpose**: Upload satellite image with metadata.

**Request Body**:
\`\`\`typescript
{
  image: File
  location_name: string
  latitude?: number
  longitude?: number
  capture_date?: string
  image_type: 'rgb' | 'multispectral' | 'infrared'
}
\`\`\`

**Response**:
\`\`\`typescript
{
  id: string
  image_url: string
  // ... other metadata
}
\`\`\`

**Process**:
1. Authenticate user
2. Upload image to Supabase Storage
3. Create database record
4. Return image metadata

#### `GET /api/images`
**Purpose**: Fetch user's uploaded images.

**Query Parameters**:
- `limit`: Number of images to return (default: 10)
- `offset`: Pagination offset

**Response**:
\`\`\`typescript
{
  images: Array<SatelliteImage>
  total: number
}
\`\`\`

#### `GET /api/analysis-results/[imageId]`
**Purpose**: Fetch all analysis results for a specific image.

**Response**:
\`\`\`typescript
{
  results: Array<AnalysisResult>
}
\`\`\`

### Analysis Routes

#### `POST /api/analyze/classical-ml`
**Purpose**: Run classical ML model on satellite image.

**Request Body**:
\`\`\`typescript
{
  imageId: string
  imageUrl: string
}
\`\`\`

**Response**:
\`\`\`typescript
{
  id: string
  degradation_level: string
  confidence_score: number
  prediction_data: {
    probabilities: {
      none: number
      low: number
      moderate: number
      high: number
      severe: number
    }
    feature_importance: Record<string, number>
  }
}
\`\`\`

**Process**:
1. Authenticate user
2. Execute Python ML model
3. Parse results
4. Store in database
5. Return analysis results

#### `POST /api/analyze/cnn-erosion`
**Purpose**: Run CNN erosion detection model.

**Request Body**: Same as classical-ml

**Response**:
\`\`\`typescript
{
  id: string
  erosion_detected: boolean
  confidence_score: number
  prediction_data: {
    erosion_probability: number
    affected_areas: Array<{x: number, y: number, severity: number}>
  }
}
\`\`\`

#### `POST /api/analyze/cnn-vegetation`
**Purpose**: Run CNN vegetation loss analysis.

**Request Body**: Same as classical-ml

**Response**:
\`\`\`typescript
{
  id: string
  vegetation_loss_percentage: number
  confidence_score: number
  prediction_data: {
    ndvi_change: number
    affected_regions: Array<Region>
  }
}
\`\`\`

#### `POST /api/analyze/segmentation`
**Purpose**: Run Gemini-powered image segmentation.

**Request Body**: Same as classical-ml

**Response**:
\`\`\`typescript
{
  id: string
  prediction_data: {
    segments: Array<{
      class: string
      area_percentage: number
      confidence: number
    }>
    land_cover_map: string  // Base64 encoded image
  }
}
\`\`\`

### Chat Routes

#### `POST /api/chat`
**Purpose**: Stream chat responses from Gemini LLM.

**Request Body**:
\`\`\`typescript
{
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
  sessionId?: string
}
\`\`\`

**Response**: Server-Sent Events (SSE) stream

**Headers**:
- `X-Session-Id`: Chat session UUID

**Process**:
1. Authenticate user
2. Create or retrieve chat session
3. Save user message to database
4. Stream LLM response
5. Save assistant response on completion

#### `GET /api/chat/sessions`
**Purpose**: Fetch user's chat sessions.

**Response**:
\`\`\`typescript
{
  sessions: Array<ChatSession>
}
\`\`\`

#### `GET /api/chat/[sessionId]/messages`
**Purpose**: Fetch messages for a specific chat session.

**Response**:
\`\`\`typescript
{
  messages: Array<ChatMessage>
}
\`\`\`

### Prediction Routes

#### `POST /api/predictions`
**Purpose**: Generate climate scenario prediction.

**Request Body**:
\`\`\`typescript
{
  location_name: string
  latitude: number
  longitude: number
  climate_scenario: string
  prediction_year: number
}
\`\`\`

**Response**:
\`\`\`typescript
{
  id: string
  risk_level: string
  prediction_data: {
    temperature_change: number
    precipitation_change: number
    soil_moisture_change: number
    vegetation_decline: number
    erosion_risk: number
    recommendations: Array<string>
  }
}
\`\`\`

#### `GET /api/predictions`
**Purpose**: Fetch user's predictions.

**Response**:
\`\`\`typescript
{
  predictions: Array<Prediction>
}
\`\`\`

---

## Machine Learning Models

### 1. Classical ML Model (`scripts/ml_models/classical_ml_model.py`)

**Purpose**: Predict land degradation levels using traditional machine learning.

**Algorithm**: Random Forest Classifier + Random Forest Regressor

**Features**:
- NDVI (Normalized Difference Vegetation Index)
- Soil moisture percentage
- Temperature (°C)
- Precipitation (mm)
- Slope angle (degrees)
- Elevation (meters)
- Land use code

**Outputs**:
- Degradation level (0-4: none, low, moderate, high, severe)
- Confidence score (0-1)
- Probability distribution across all levels
- Feature importance scores

**Training**:
\`\`\`python
classifier = LandDegradationClassifier()
classifier.train(X_train, y_train)
\`\`\`

**Prediction**:
\`\`\`python
result = classifier.predict(features)
# Returns: {degradation_level, confidence, probabilities}
\`\`\`

### 2. CNN Erosion Detector (`scripts/ml_models/cnn_erosion_detector.py`)

**Purpose**: Detect soil erosion patterns in satellite imagery.

**Architecture**: Convolutional Neural Network (PyTorch)

**Layers**:
\`\`\`
Input (3 channels, 224x224)
  ↓
Conv2D (32 filters, 3x3) + ReLU + MaxPool
  ↓
Conv2D (64 filters, 3x3) + ReLU + MaxPool
  ↓
Conv2D (128 filters, 3x3) + ReLU + MaxPool
  ↓
Flatten + Dense (256) + Dropout
  ↓
Output (2 classes: erosion/no-erosion)
\`\`\`

**Preprocessing**:
- Resize to 224x224
- Normalize pixel values
- Data augmentation (rotation, flip, brightness)

**Outputs**:
- Erosion detected (boolean)
- Confidence score
- Spatial erosion map
- Affected area percentage

### 3. Vegetation Loss CNN (`scripts/ml_models/vegetation_loss_cnn.py`)

**Purpose**: Quantify vegetation loss and NDVI changes.

**Architecture**: Similar to erosion detector with regression head

**Outputs**:
- Vegetation loss percentage (0-100)
- NDVI change value
- Confidence interval
- Spatial vegetation map

### 4. Segmentation Model (Gemini 2.5)

**Purpose**: Segment satellite imagery into land cover classes.

**Method**: Transfer learning with Gemini Vision API

**Classes**:
- Forest
- Grassland
- Cropland
- Urban
- Water
- Barren land

**Outputs**:
- Segmentation mask
- Class probabilities
- Area percentages
- Change detection (if historical data available)

---

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- Python 3.9+ (for ML models)
- Supabase account
- Vercel account (for deployment)

### 1. Clone Repository

\`\`\`bash
git clone <repository-url>
cd terrestrial
\`\`\`

### 2. Install Dependencies

\`\`\`bash
# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt
\`\`\`

### 3. Environment Variables

Create a `.env.local` file:

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database (auto-configured by Supabase)
POSTGRES_URL=your_postgres_url
POSTGRES_PRISMA_URL=your_prisma_url

# AI Model
GOOGLE_API_KEY=your_google_api_key

# Redirect URLs
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

### 4. Database Setup

Run the SQL scripts in Supabase SQL Editor:

\`\`\`bash
# 1. Create tables
scripts/001_create_tables.sql

# 2. Create triggers
scripts/002_create_profile_trigger.sql
\`\`\`

### 5. Train ML Models (Optional)

\`\`\`bash
cd scripts/ml_models
python classical_ml_model.py
python cnn_erosion_detector.py
python vegetation_loss_cnn.py
\`\`\`

### 6. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000`

---

## Usage Guide

### 1. User Registration

1. Navigate to `/auth/sign-up`
2. Enter email and password
3. Verify email (check inbox)
4. Complete profile setup

### 2. Upload Satellite Image

1. Go to Dashboard
2. Click "Upload Image" card
3. Select image file (RGB, multispectral, or infrared)
4. Fill in metadata:
   - Location name
   - Coordinates (latitude/longitude)
   - Capture date
   - Image type
5. Submit form

### 3. Run Analysis

1. Navigate to uploaded image detail page
2. Click "Run All Analyses" button
3. Wait for sequential model execution:
   - Classical ML (5-10 seconds)
   - CNN Erosion (10-15 seconds)
   - CNN Vegetation (10-15 seconds)
   - Segmentation (15-20 seconds)
4. View results in analysis cards

### 4. Interpret Results

**Degradation Levels**:
- **None**: Healthy land, no intervention needed
- **Low**: Minor degradation, monitoring recommended
- **Moderate**: Noticeable degradation, preventive measures advised
- **High**: Significant degradation, restoration required
- **Severe**: Critical degradation, urgent intervention needed

**Confidence Scores**:
- 90-100%: Very high confidence
- 75-89%: High confidence
- 60-74%: Moderate confidence
- Below 60%: Low confidence (consider re-analysis)

### 5. Chat with AI Assistant

1. Click "AI Chat" from dashboard
2. Ask questions about:
   - Analysis results interpretation
   - Land restoration strategies
   - Environmental factors
   - Best practices
3. Receive expert recommendations

### 6. Generate Climate Predictions

1. Navigate to Predictions page
2. Enter location details
3. Select climate scenario:
   - Current Trends
   - Moderate Warming (+2°C)
   - High Warming (+4°C)
   - Drought Stress
   - Extreme Weather
4. Choose prediction year (2030-2100)
5. Review risk assessment and recommendations

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGc...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `eyJhbGc...` |
| `POSTGRES_URL` | PostgreSQL connection string | `postgresql://...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GOOGLE_API_KEY` | Google AI API key | - |
| `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` | Dev redirect URL | `http://localhost:3000` |

---

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

\`\`\`bash
# Or use Vercel CLI
vercel --prod
\`\`\`

### Database Migration

Supabase automatically handles migrations. For manual migrations:

\`\`\`bash
# Create migration
supabase migration new migration_name

# Apply migration
supabase db push
\`\`\`

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## License

This project is licensed under the MIT License.

---

## Acknowledgments

- Vercel for hosting and AI SDK
- Supabase for database and authentication
- Google for LLM capabilities
- scikit-learn and PyTorch communities
- shadcn/ui for component library

---

**Built with ❤️ for environmental conservation**
