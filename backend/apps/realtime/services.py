import requests
from django.conf import settings

class ZoomService:
    def __init__(self):
        self.account_id = settings.ZOOM_ACCOUNT_ID
        self.client_id = settings.ZOOM_CLIENT_ID
        self.client_secret = settings.ZOOM_CLIENT_SECRET
        self.base_url = "https://api.zoom.us/v2"

    def get_access_token(self):
        # Mock implementation for now
        # Real implementation would use requests to get OAuth token
        return "mock_access_token"

    def create_meeting(self, topic, start_time, duration, agenda=""):
        token = self.get_access_token()
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        data = {
            "topic": topic,
            "type": 2, # Scheduled meeting
            "start_time": start_time,
            "duration": duration,
            "agenda": agenda,
            "settings": {
                "host_video": True,
                "participant_video": False,
                "join_before_host": False,
                "mute_upon_entry": True,
                "waiting_room": True
            }
        }
        
        # Mock response
        return {
            "id": 123456789,
            "join_url": "https://zoom.us/j/123456789",
            "start_url": "https://zoom.us/s/123456789"
        }
