# Story Generator

A full-stack interactive storytelling app that generates branching, choose-your-own-adventure stories using AI. The application combines a FastAPI backend with a React frontend so users can enter a theme, generate a story job, and explore a dynamically generated narrative with multiple endings.

## Overview

This project allows a user to:

- enter a theme such as fantasy, sci-fi, mystery, or adventure
- submit a story generation request to the backend
- wait for an AI-powered job to complete in the background
- view the generated story tree and choose different paths
- restart or generate a new story

The backend uses FastAPI, SQLAlchemy, and LangChain with Google Gemini to generate structured story content. The frontend is a Vite + React app that presents a simple and engaging story experience.

## Features

- AI-generated choose-your-own-adventure stories
- Background job processing for long-running story generation
- Session-based story tracking
- Branching story nodes with multiple paths and endings
- Winning and losing ending detection
- REST API with Swagger/OpenAPI docs
- Modern frontend UI for story creation and exploration
- SQLite database support via SQLAlchemy

## Tech Stack

### Backend

- Python 3.13+
- FastAPI
- SQLAlchemy
- Pydantic
- LangChain
- LangChain Google Generative AI
- Uvicorn
- SQLite

### Frontend

- React 19
- Vite
- JavaScript
- React Router
- Axios

## Project Structure

```text
Story-Generator/
├── README.md
├── backend/
│   ├── README.md
│   ├── .env.example
│   ├── database.db
│   ├── main.py
│   ├── pyproject.toml
│   ├── uv.lock
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── model.py
│   │   ├── prompts.py
│   │   └── story_generator.py
│   ├── db/
│   │   ├── __init__.py
│   │   └── database.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── job.py
│   │   └── story.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── job.py
│   │   └── story.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── job.py
│   │   └── story.py
│   └── .venv/            # if created locally
├── client/
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── vite.config.js
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   └── src/
│       ├── App.css
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── utils.js
│       └── components/
│           ├── LoadingStatus.jsx
│           ├── StoryGame.jsx
│           ├── StoryGenerator.jsx
│           ├── StoryLoader.jsx
│           └── ThemeInput.jsx
└── .git/
```

## Backend Architecture

The backend follows a small layered structure:

- `main.py` initializes the FastAPI app and includes routers
- `core/config.py` loads environment variables
- `core/story_generator.py` calls the Gemini model and parses the story JSON
- `models/` defines the SQLAlchemy database models
- `schemas/` defines request and response validation models
- `routers/` exposes API endpoints for story creation and job status
- `db/database.py` creates the SQLAlchemy engine and session factory

The story generation flow is:

1. The client sends a story creation request with a theme.
2. The backend creates a `StoryJob` record and returns a job ID.
3. A background task begins generating the story.
4. The LLM is invoked with a prompt designed to produce a branching story tree.
5. The returned JSON is parsed and stored as story nodes.
6. The client polls the job status endpoint until completion.
7. The frontend loads the story from the complete story API.

## Frontend Architecture

The client app is intentionally simple and focused:

- `App.jsx` configures the main routes
- `ThemeInput.jsx` gathers the story theme from the user
- `StoryGenerator.jsx` submits a story generation job and polls for status
- `StoryLoader.jsx` loads the completed story for rendering
- `StoryGame.jsx` drives interactive story navigation through the node tree

## Environment Configuration

Create a `.env` file in the `backend/` directory based on the provided `.env.example` file.

Example:

```env
DATABASE_URL="sqlite:///./database.db"
API_PREFIX=/api
DEBUG=True
ALLOWED_ORIGINS=http://localhost:5173
GOOGLE_API_KEY=your_google_gemini_api_key
```

### Required variables

- `DATABASE_URL`: database connection string
- `API_PREFIX`: API base prefix (default `/api`)
- `ALLOWED_ORIGINS`: comma-separated allowed CORS origins
- `GOOGLE_API_KEY`: API key for Gemini generation

## Prerequisites

Before running the project, make sure you have:

- Python 3.13 or newer
- Node.js and npm or pnpm
- A Google Gemini API key
- An available terminal environment

## Setup and Installation

### 1) Backend setup

From the project root:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Linux/macOS
# or .venv\Scripts\activate  # Windows
pip install -U pip
pip install -e .
```

If you use `uv` (recommended with the included lock file):

```bash
cd backend
uv sync
```

### 2) Frontend setup

From the project root:

```bash
cd client
npm install
```

You can also use pnpm if preferred:

```bash
cd client
pnpm install
```

## Running the Application

### Start the backend

```bash
cd backend
source .venv/bin/activate   # Linux/macOS
# or .venv\Scripts\activate  # Windows
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API should run at:

- http://localhost:8000
- Swagger docs: http://localhost:8000/docs

### Start the frontend

```bash
cd client
npm run dev
```

Then open the local Vite URL (typically http://localhost:5173).

## API Endpoints

The backend exposes the following endpoints under `/api`:

### Stories

- `POST /api/stories/create` — create a story generation job
- `GET /api/stories/{story_id}/complete` — fetch the complete story tree

### Jobs

- `GET /api/jobs/{job_id}` — fetch job status

### Root

- `GET /` — basic health route

### OpenAPI docs

- `GET /docs` — interactive Swagger UI
- `GET /redoc` — ReDoc UI

## Example Story Flow

1. User enters a theme: `Fantasy`.
2. Backend creates a job and returns a `job_id`.
3. The frontend polls until status becomes `completed`.
4. The final story payload is retrieved.
5. The user reads the current node and chooses from available options.
6. Each choice navigates through the story graph until an ending is reached.

## Database

The application is configured to use SQLAlchemy models and automatically creates tables at startup using `create_tables()` from `db/database.py`.

The current project uses SQLite by default, which makes local development simple and self-contained.

## Notes

- The app relies on Google Gemini for story generation, so a valid API key is required.
- The generated story is stored as a structured branching tree using database JSON fields and node relationships.
- Job processing is asynchronous via FastAPI `BackgroundTasks`.
- The frontend and backend are designed to work together through the shared `/api` prefix and CORS configuration.

## Related Documentation

- [backend/README.md](backend/README.md)
- [client/README.md](client/README.md)

## Future Enhancements

Potential improvements for this project include:

- adding user authentication and saved stories
- supporting richer story branching and AI story refinement
- introducing persistent job queues with Celery or Redis
- adding export/share features for generated stories
- improving retry logic and job monitoring
- adding tests for backend and frontend flows

## License

This project does not currently include an explicit license file. If you plan to distribute or deploy it publicly, add an appropriate license such as MIT or Apache-2.0.
