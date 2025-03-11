import asyncio
import websockets

async def connect_admin():
    uri = "ws://127.0.0.1:8000/ws?username=nir13"

    async with websockets.connect(uri) as websocket:
        print("Connected as admin!")

        try:
            while True:
                await asyncio.sleep(1)
        except websockets.ConnectionClosed:
            print("WebSocket connection closed! Retrying...")
            await asyncio.sleep(2)
            await connect_admin()


asyncio.run(connect_admin())

