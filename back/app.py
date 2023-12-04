from flask import Flask, request, jsonify
from flask_cors import CORS
from llama_cpp import Llama

app = Flask(__name__)
CORS(app)

@app.route('/process', methods=['POST'])
def process_text():
    data = request.get_json()
    text = data['text']

    llm = Llama(
        model_path="./models/codellama-7b-instruct.Q4_K_S.gguf",
        n_gpu_layers=1, # use GPU
        verbose=False,  # omit log output
    )

    # Generate Chat format
    output = llm.create_chat_completion(
        messages=[
            {"role": "system", "content": "You are a helpful programing assistant."},
            {
                "role": "user",
                "content": text,
            },
        ],
        temperature=0.1,
        max_tokens=512,
    )
    return jsonify({'text': output["choices"][0]["message"]["content"]})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
