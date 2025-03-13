from fastapi import WebSocket
from database import get_user_role


class ConnectionManager:
    """Manages WebSocket connections (tracks players and the admin)."""

    def __init__(self):
        self.active_connections = []
        self.admin = None  # Store admin connection

    async def connect(self, websocket: WebSocket, username: str):
        """Adds a new connection and tracks if it's an admin."""
        await websocket.accept()
        role = get_user_role(username)

        if role == "admin":
            self.admin = websocket  # Track the admin connection
            print(f"Admin {username} connected!")
        else:
            self.active_connections.append(websocket)  # Store players
            print(f"Player {username} connected!")

    def disconnect(self, websocket: WebSocket):
        """Removes a disconnected WebSocket."""
        if websocket == self.admin:
            print("Admin disconnected!")
            self.admin = None  # Remove admin
        elif websocket in self.active_connections:
            print("Player disconnected!")
            self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        """Sends a message to all connected players."""
        for connection in self.active_connections:
            await connection.send_text(message)
