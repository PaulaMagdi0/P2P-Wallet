from flask import Flask
from flask_cors import CORS
from flask_graphql import GraphQLView
import os

# Relative imports with fallback
try:
    from .db import db_session
    from .schema import schema
except ImportError:
    from db import db_session
    from schema import schema

# Create the Flask application
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "default-insecure-secret")
CORS(app, resources={r"/graphql/*": {"origins": "*"}})

# Add the GraphQL endpoint
app.add_url_rule(
    '/graphql',
    view_func=GraphQLView.as_view(
        'graphql',
        schema=schema,
        graphiql=True
    )
)

@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()

if __name__ == '__main__':
    app.run(port=8000)