'use client'; // Ensure this is treated as a client-side component
import { useState, useEffect } from 'react';
import Button from './components/Button';  // Your custom button component

export default function Home() {
  const [urls, setUrls] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  // Listen for responses from the content script
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.action === 'bookmarksResponse') {
        if (event.data.bookmarks) {
          setUrls(event.data.bookmarks);  // Keep updating state with received bookmarks
          console.log("Bookmarks retrieved:", event.data.bookmarks);  // Log them for debugging
          setErrorMessage(null);  // Clear error message if successful
        } else {
          setErrorMessage("Failed to retrieve bookmarks.");
        }
      }
    };
    
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Function to send a message to the content script
  const getBookmarksFromExtension = () => {
    if (typeof window !== 'undefined') {
      // Send a message to the content script to fetch bookmarks
      window.postMessage({ action: 'getBookmarks' }, '*');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center space-y-4">
      <h1 className="text-4xl font-bold">Retrieve Learning Folder Bookmarks</h1>
      
      <Button onClick={getBookmarksFromExtension}>
        Get Learning Bookmarks
      </Button>

      {errorMessage && (
        <p className="text-red-500">{errorMessage}</p>  // Display error message if needed
      )}
    </div>
  );
}
