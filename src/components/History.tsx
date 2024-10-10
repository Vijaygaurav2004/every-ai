import React, { useEffect, useState } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { HISTORY_API_URL } from '../config';
import { Trash } from 'lucide-react';

interface HistoryItem {
  id: number;
  tool_name: string;
  prompt: string;
  response_type: 'text' | 'image';
  response: string;
  created_at: string;
}

const History: React.FC = () => {
  const [user] = useAuthState(auth);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const response = await fetch(`${HISTORY_API_URL}/history?userId=${user.uid}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched history:', data);
        if (data.results) {
          setHistory(data.results);
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (error) {
        console.error('Error fetching history:', error);
        setError(`Failed to fetch history: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const deleteHistoryItem = async (id: number) => {
    // ... (deleteHistoryItem implementation)
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading history...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">History</h2>
      <ScrollArea className="h-[calc(100vh-200px)]">
        {history.length === 0 ? (
          <p className="text-center">No history available.</p>
        ) : (
          history.map((item) => (
            <div key={item.id} className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg relative">
              <h3 className="font-bold">{item.tool_name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Prompt: {item.prompt}</p>
              {item.response_type === 'text' ? (
                <p className="text-sm mt-2">Response: {item.response.substring(0, 100)}...</p>
              ) : (
                <img src={`data:image/png;base64,${item.response}`} alt="Generated image" className="mt-2 max-w-full h-auto" />
              )}
              <p className="text-xs text-gray-500 mt-2">{new Date(item.created_at).toLocaleString()}</p>
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => deleteHistoryItem(item.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  );
};

export default History;