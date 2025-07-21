from flask import Flask
from flask_cors import CORS

from routes.map_routes import map_bp

app = Flask(__name__)
CORS(app)

# Register Blueprints
app.register_blueprint(map_bp)

if __name__ == '__main__':
    app.run(debug=True)
