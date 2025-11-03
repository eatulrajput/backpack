## File Structure

```bash

/astra-backend/
│
├── app/
│   ├── __init__.py             # Application factory, extension setup
│   ├── configs/
│   │   ├── default.py          # Default configuration
│   │   ├── development.py
│   │   ├── production.py
│   ├── blueprints/               # Modular route organization
│   │   ├── auth/
│   │   │   ├── __init__.py
│   │   │   ├── routes.py
│   │   ├── main/
│   │   │   ├── __init__.py
│   │   │   ├── routes.py
│   │   ├── rag/
│   │   │   ├── __init__.py
│   │   │   ├── routes.py
│   ├── models/                   # Data schemas (if using ORM)
│   │   ├── user.py
│   │   ├── document.py
│   ├── services/                 # Utility classes/functions (LLM, DB, etc.)
│   │   ├── llm_service.py
│   │   ├── db_service.py
│   ├── extensions.py             # Initialize extensions (MongoDB, JWT, etc.)
│   ├── config.py                 # Central config access
│
├── migrations/                   # Database migrations (if using)
├── tests/                        # Test modules
│   ├── test_auth.py
│   ├── test_main.py
│   ├── test_rag.py
│
├── requirements.txt              # Project dependencies
├── run.py                        # Entry point to run the app
└── README.md                     # Project description & setup instructions
```
