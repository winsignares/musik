from flask import Flask, render_template, request, redirect 
from config.db import app

#Importación de rutas

from api.UserApi import ruta_user
from api.CategoryApi import ruta_category
from api.TaskApi import ruta_task

#Registro de rutas con blueprint

app.register_blueprint(ruta_user, url_prefix='api')
app.register_blueprint(ruta_category, url_prefix='api')
app.register_blueprint(ruta_task, url_prefix='api')

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')