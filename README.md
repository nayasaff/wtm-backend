# Notification Logic

This server handles the logic for job applications
This server uses nestjs and node version 18.20.8

## Project Structure

### .env
Defines environemnt variables:

- **`PORT`**: Port to run server on.
- **`DATABASE_URL`**: Postgresql database.
- **`SECRET_KEY`**: Cryptographic secret used for JWT token generation and verification. 
- **`FRONTEND_URL`**: To allow only frontend url to send requests to the server.



## Running locally

To run locally follow these steps :

1. **Migrate database** :

     ```bash
     npx prisma migrate dev
     ```

2. **Install dependencies**
   ```bash
   npm install

3. Create .env file and include environment varaibles above


5. **Run the server**
    ```bash
    npm run start:dev



