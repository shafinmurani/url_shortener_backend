# URL Shortener API

A simple Node.js and Express API for shortening URLs, using MongoDB and Mongoose.

## Features

- Shorten any valid URL to a unique short code
- Retrieve the original URL using the short code
- Returns the same short code if the URL was already shortened
- Robust error handling for invalid input and duplicates
- CORS enabled for easy integration

## Endpoints

### POST /shorten

Shortens a given URL.

**Request Body:**

```json
{
  "originalUrl": "https://example.com"
}
```

**Response:**

```json
{
  "shortUrl": "abc123"
}
```

If the URL was already shortened, returns the existing short code.

### POST /get

Retrieves the original URL for a given short code.

**Request Body:**

```json
{
  "id": "abc123"
}
```

**Response:**

```json
{
  "originalUrl": "https://example.com"
}
```

### GET /

Returns a status message.

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with your MongoDB URI:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```
4. Start the server:
   ```
   npm start
   ```

## License

MIT
