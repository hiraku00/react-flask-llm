FROM python:3.10

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

# hot reload
# CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]
CMD [ "flask", "run", "--host=0.0.0.0", "--port=5000", "--reload"]
