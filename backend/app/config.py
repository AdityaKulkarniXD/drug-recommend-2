from dotenv import load_dotenv, find_dotenv

env_path = find_dotenv()
print(f".env path found: {env_path}")

load_dotenv(env_path)

import os
print(f"GEMINI_API_KEY after loading .env: {os.getenv('GEMINI_API_KEY')}")
