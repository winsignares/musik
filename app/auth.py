from functools import wraps
from flask import session, redirect, url_for, flash

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session or session.get('user_role') != 'admin':
            flash("No tienes permiso para acceder a esta página", "error")
            return redirect(url_for('principal'))
        return f(*args, **kwargs)
    return decorated_function

def user_required(f1):
    @wraps(f1)
    def decorated_function1(*args, **kwargs):
        if 'user_id' not in session or session.get('user_role') != 'usuario':
            flash("No tienes permiso para acceder a esta página", "error")
            return redirect(url_for('principal'))
        return f1(*args, **kwargs)
    return decorated_function1