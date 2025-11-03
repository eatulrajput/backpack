from flask import Blueprint, jsonify
from app.services.rag import get_context
from app.services.llm_service import ask_llm

@app.route('/some-endpoint', methods=['POST'])
def handle_question():
    data = request.get_json()
    question = data.get('question')
    context = get_context(question)
    # Use context for further processing or response


@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    question = data.get('question')
    context = get_context(question)
    response = ask_llm(question, context)
    return jsonify({"response": response})

main_bp = Blueprint('main', __name__)

@main_bp.route('/status', methods=['GET'])
def status():
    return jsonify({"status": "API is running"})
