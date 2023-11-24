# 201-finalproject

## Setting up Firebase Configuration

1. Go to your Firebase project settings in the Firebase Console.

2. Locate the Firebase configuration values, including:
   - Firebase API Key
   - Firebase Auth Domain
   - Firebase Project ID
   - Firebase Storage Bucket
   - Firebase Messaging Sender ID
   - Firebase App ID
   - Firebase Measurement ID

3. In your `webapp` folder, create a `.env` file if it doesn't already exist.

4. Add the following Firebase configuration variables to your `.env` file:

```env
REACT_APP_FIREBASE_API_KEY="Your-API-Key"
REACT_APP_FIREBASE_AUTH_DOMAIN="Your-Auth-Domain"
REACT_APP_FIREBASE_PROJECT_ID="Your-Project-ID"
REACT_APP_FIREBASE_STORAGE_BUCKET="Your-Storage-Bucket"
REACT_APP_FIREBASE_MESSAGING_SENDER_ID="Your-Messaging-Sender-ID"
REACT_APP_FIREBASE_APP_ID="Your-App-ID"
REACT_APP_FIREBASE_MEASUREMENT_ID="Your-Measurement-ID"
```


## Running the App

**Navigate to the web app folder:**

```bash
cd src/main/webapp
```

Install project dependencies:
```bash
npm install
```

Start the development server:
```bash
npm start
```
