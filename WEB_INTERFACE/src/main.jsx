import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // This looks for 'export default' in App.jsx
import { Amplify } from 'aws-amplify';

// ... (your Amplify.configure code)

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'ap-south-1_u2EGN1BAl', // Put your ID here
      userPoolClientId: 'bb6q7o8vgn00amt9lfqig3re0' // Put your Client ID here
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
