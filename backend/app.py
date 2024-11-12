# Any entry point to run the Flask app

from create_app import createApp



app = createApp()

if __name__ == '__main__':
    app.run(port=5002,debug=True)