from flask import Flask, render_template, request, redirect 
from config.db import app

#Importación de rutas


#Registro de rutas con blueprint


@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')