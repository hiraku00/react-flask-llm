from flask import Flask, request, jsonify
from flask_cors import CORS
from llama_cpp import Llama

app = Flask(__name__)
CORS(app)

@app.route('/process', methods=['POST'])
def process_text():
    data = request.get_json()
    messages = data['messages']

    # メッセージのリストを作成
    formatted_messages = [
        {
            "role": message['type'],
            "content": message['text'],
        }
        for message in messages
    ]

    llm = Llama(
        model_path="./models/codellama-7b-instruct.Q4_K_S.gguf",
        n_gpu_layers=1, # use GPU
        verbose=False,  # omit log output
    )

    # Generate Chat format
    output = llm.create_chat_completion(
        messages=formatted_messages,
        temperature=0.1,
        max_tokens=512,
    )

    # レスポンスがアシスタントからのものであれば、それをチャットの履歴に追加
    if output["choices"][0]["message"]["role"] == "assistant":
        formatted_messages.append(output["choices"][0]["message"])

    return jsonify({'text': [message["content"] for message in formatted_messages if message["role"] == "assistant"]})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
