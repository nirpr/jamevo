import asyncio
import websockets


async def connect_player():
    uri = "ws://127.0.0.1:8000/ws?username=nir"
    async with websockets.connect(uri) as websocket:
        print("Connected as player!")
        try:
            while True:
                message = await websocket.recv()
                print(f"Received update: {message}")
        except websockets.ConnectionClosed:
            print("WebSocket connection closed!")

asyncio.run(connect_player())
