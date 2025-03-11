import json
import os

SONGS_DIR = "songs"


def load_songs():
    songs = []
    for filename in os.listdir(SONGS_DIR):
        if filename.endswith(".json"):
            with open(os.path.join(SONGS_DIR, filename), "r", encoding="utf-8") as f:
                data = json.load(f)
                song_name = filename.replace(".json", "").replace("_", " ").title()
                songs.append({"name": song_name, "file": filename, "data": data})
    return songs


def search_songs(query):
    query = query.lower()
    all_songs = load_songs()
    return [song for song in all_songs if query in song["name"].lower()]


def get_song_by_filename(filename):
    filepath = os.path.join(SONGS_DIR, filename)
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    return None

