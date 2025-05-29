import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@env';

export const getToken = async () => {
  
  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`
    },
    body: 'grant_type=client_credentials&scope=user-read-recently-played'
  });

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
};

 const fetchSpotifyData = async (endpoint) => {
  try {
    const token = await getToken();
    const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error fetching data: ${errorText}`);
    }

    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      const textResponse = await response.text();
      throw new Error(`Response is not JSON: ${textResponse}`);
    }
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error;
  }
};

export { fetchSpotifyData };