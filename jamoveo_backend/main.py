from fastapi import FastAPI, HTTPException, Body, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from database import create_user_table, insert_user, get_user_by_username, verify_password,\
    get_user_role, get_user_instrument
from songs import search_songs, get_song_by_filename
from ConnectionManager import ConnectionManager
import json


manager = ConnectionManager()
current_song = None
logged_in_users = set()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://jamoveo.vercel.app", "https://jamoveo-p2tf4i4y0-nirprs-projects.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, username: str):
    """Handles WebSocket connections and distinguishes between admin and players."""
    if username not in logged_in_users:
        await websocket.close()
        print(f"Unauthorized WebSocket connection attempt by {username}")
        return

    await manager.connect(websocket, username)

    try:
        while True:
            message = await websocket.receive_text()

            if message == "QUIT":
                print("Admin quit the session. Notifying all players...")
                await manager.broadcast(json.dumps({"type": "QUIT"}))
            elif websocket == manager.admin:
                print(f"Admin sent: {message}")
                await manager.broadcast(message)

    except WebSocketDisconnect:
        print(f"{username} disconnected.")
        manager.disconnect(websocket)
    except Exception as e:
        print(f"Error: {e}")


@app.get("/")
def health():
    return {"message": "Welcome"}


@app.post("/login/")
def login(data: dict = Body(...)):
    user = get_user_by_username(data['username'])
    if user and verify_password(data['password'], user["password"]):
        logged_in_users.add(data['username'])
        return {"message": "Login successful"}
    raise HTTPException(status_code=400, detail="Invalid credentials")


@app.post("/logout/")
def logout(data: dict = Body(...)):
    username = data['username']
    if username in logged_in_users:
        logged_in_users.remove(username)
        return {"message": "Logout successful"}

    raise HTTPException(status_code=400, detail="User not logged in")


@app.post("/signup/")
def signup(data: dict = Body(...)):
    role = data["role"]
    try:
        insert_user(data['username'], data['password'], role, data['instrument'])
        logged_in_users.add(data['username'])
        return {"message": f"{data['username']} registered successfully as {role}"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/search/")
def search(query: str, username: str):
    role = get_user_role(username)
    if role != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can search for songs")

    results = search_songs(query)
    return {"results": results}


@app.post("/choose-song/")
async def choose_song(data: dict = Body(...)):
    global current_song
    filename = data["filename"]
    song = get_song_by_filename(filename)

    if not song:
        raise HTTPException(status_code=404, detail="Song not found")

    song_name = filename.replace(".json", "").replace("_", " ").title()  # Fallback
    author = "Unknown"

    if isinstance(song[0], dict):
        song_name = song[0].get("name", song_name)
        author = song[0].get("author", "Unknown")

    current_song = {"filename": filename, "data": song}

    await manager.broadcast(json.dumps({
        "type": "song_selected",
        "song_name": song_name,
        "author": author,
        "data": song
    }))

    return {"name": song_name, "author": author, "data": song}


@app.get("/current-song/")
def get_current_song():
    if not current_song:
        raise HTTPException(status_code=404, detail="No song selected")
    return current_song


@app.get("/get-role/")
def get_role_from_db(username: str):
    if username not in logged_in_users:
        raise HTTPException(status_code=400, detail="User not logged in")
    role = get_user_role(username)
    return {"role": role}


@app.get("/get-instrument/")
def get_instrument(username: str):
    instrument = get_user_instrument(username)
    if not instrument:
        raise HTTPException(status_code=404, detail="Instrument not found")
    return {"instrument": instrument}


create_user_table()
