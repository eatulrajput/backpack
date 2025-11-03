import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from groq import Groq
from marshmallow import Schema, fields, ValidationError
import click
from app.services.ingest import ingest_documents
from app.services.rag import get_context
from app.services.llm_service import ask_llm


# Load environment variables
load_dotenv()

# Verify Groq API key exists
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise RuntimeError("❌ GROQ_API_KEY not found. Please check your .env file.")

# Initialize Flask app
app = Flask(__name__)

# Enable CORS (adjust origin for production)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# Initialize Groq client
client = Groq(api_key=GROQ_API_KEY)

# Marshmallow schemas
class ItemSchema(Schema):
    name = fields.Str(required=True)
    price = fields.Float(required=True)
    is_offer = fields.Bool(load_default=None)

class QuerySchema(Schema):
    question = fields.Str(required=True)

class GroqQuerySchema(Schema):
    message = fields.Str(required=True)

@app.route("/", methods=["GET"])
def read_root():
    return jsonify({"Hello": "World"})

@app.route("/items/<int:item_id>", methods=["GET"])
def read_item(item_id):
    q = request.args.get('q')
    return jsonify({"item_id": item_id, "q": q})

@app.route("/items/<int:item_id>", methods=["PUT"])
def update_item(item_id):
    try:
        data = request.get_json()
        item = ItemSchema().load(data)
        return jsonify({"item_name": item['name'], "item_id": item_id})
    except ValidationError as err:
        return jsonify(err.messages), 400


@app.cli.command("ingest-docs")
def ingest_docs():
    """Ingest documents into Chroma vector store."""
    ingest_documents()

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        query = QuerySchema().load(data)
        context = get_context(query['question'])
        response = ask_llm(query['question'], context)
        return jsonify({"response": response})
    except ValidationError as err:
        return jsonify(err.messages), 400
    except Exception as e:
        return jsonify({"error": f"RAG error: {str(e)}"}), 500

@app.route("/groq-chat", methods=["POST"])
def groq_chat():
    try:
        data = request.get_json()
        query = GroqQuerySchema().load(data)
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant."},
                {"role": "user", "content": query['message']},
            ],
        )
        reply = response.choices[0].message.content
        return jsonify({"reply": reply})
    except ValidationError as err:
        return jsonify(err.messages), 400
    except Exception as e:
        print(f"❌ Groq API error: {e}")
        return jsonify({"error": f"Groq API error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
