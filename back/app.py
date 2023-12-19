from flask import Flask, request, jsonify
from flask_cors import CORS
from llama_cpp import Llama
import google.generativeai as genai
import PIL.Image
import os
from dotenv import load_dotenv
import json

app = Flask(__name__)
CORS(app)

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

MODEL_LLAMA_PATH = "./models/codellama-7b-instruct.Q4_K_S.gguf"
MODEL_LLAMA = "llama2-7B"
MODEL_GEMINI_PRO = "gemini-pro"
MODEL_GEMINI_PRO_V = "gemini-pro-vision"

config = {
    "temperature": 0.9,
    "top_p": 1,
    "top_k": 1,
    "max_output_tokens": 4096,
}

llama = Llama(
    model_path=MODEL_LLAMA_PATH,
    n_gpu_layers=1, # use GPU
    verbose=False,  # omit log output
)
gem_p = genai.GenerativeModel(model_name=MODEL_GEMINI_PRO,
                                generation_config=config)
gem_p_v = genai.GenerativeModel(model_name=MODEL_GEMINI_PRO_V,
                                generation_config=config)

def proc_llama2():
    messages = json.loads(request.form['messages'])
    msg = [
        {
            "role": message['type'],
            "content": message['text'],
        }
        for message in messages
    ]
    response = llama.create_chat_completion(
        messages=msg,
        temperature=0.1,
        max_tokens=4096,
    )

    return jsonify({'text': response["choices"][0]["message"]["content"]})

def proc_gemini_pro():
    messages = json.loads(request.form['messages'])
    msg = [
        {
            "role": message['type'],
            "parts": [message['text']],
        }
        for message in messages
    ]
    chat = gem_p.start_chat(history=msg)
    text = request.form['text']
    try:
        response = chat.send_message(text)
    except Exception as e:
        return jsonify({'errror': str(e)}), 500
    return jsonify({'text': response.text})

def proc_gemini_pro_vision():
    text = request.form['text']

    image = request.files["image"]
    if image is None:
        return jsonify({'eroor': 'No image provided'}), 400
    img = PIL.Image.open(image)

    response = gem_p_v.generate_content([
        text,
        img
    ], stream=True)

    response.resolve()
    return jsonify({'text': response.text})

@app.route('/process', methods=['POST'])
def process_text():
    model = request.form['model']

    proc_func = {
        MODEL_LLAMA: proc_llama2,
        MODEL_GEMINI_PRO: proc_gemini_pro,
        MODEL_GEMINI_PRO_V: proc_gemini_pro_vision,
    }

    func = proc_func.get(model)

    if func is None:
        return jsonify({'error': 'Invalid model name'}), 400
    return func()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
