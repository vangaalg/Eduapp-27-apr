import React, { useState, useEffect } from 'react';
import { adminStorage } from '../utils/adminStorage';
import { Upload, FolderPlus, Trash2, RefreshCw } from 'lucide-react';
import { openaiService } from '../services/openai';
import { supabase } from '../lib/supabaseClient';
import { Message, UserProfile, LearningPlan } from '../types';

interface FileItem {
  name: string;
  id: string;
  metadata?: Record<string, any>;
}

const INITIAL_FOLDERS = {
  'study_materials': [
    'physics/mechanics',
    'physics/electromagnetism',
    'chemistry/organic',
    'chemistry/inorganic',
    'mathematics/calculus',
    'mathematics/algebra'
  ],
  'assignments': [
    'submissions/physics',
    'submissions/chemistry',
    'submissions/mathematics'
  ],
  'quiz_attachments': [
    'physics',
    'chemistry',
    'mathematics'
  ]
};

export const AdminStorageManager: React.FC = () => {
  const [selectedBucket, setSelectedBucket] = useState<string>('study_materials');
  const [currentPath, setCurrentPath] = useState<string>('');
  const [contents, setContents] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [learningPlan, setLearningPlan] = useState<LearningPlan[]>([]);

  const buckets = ['study_materials', 'profile_images', 'assignments', 'quiz_attachments'];

  useEffect(() => {
    loadContents();
    loadUserProfile();
    loadChatHistory();
  }, [selectedBucket, currentPath]);

  const loadContents = async () => {
    try {
      setLoading(true);
      const data = await adminStorage.listContents(selectedBucket, currentPath);
      setContents(data || []);
    } catch (error) {
      showMessage('Error loading contents', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .single();

      if (error) throw error;
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadChatHistory = async () => {
    try {
      const { data: history, error } = await supabase
        .from('chat_history')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(history || []);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    try {
      setLoading(true);
      const file = files[0];
      await adminStorage.uploadFile({
        bucket: selectedBucket as any,
        folder: currentPath,
        file
      });
      showMessage('File uploaded successfully', 'success');
      loadContents();
    } catch (error) {
      showMessage('Error uploading file', 'error');
    } finally {
      setLoading(false);
    }
  };

  const createInitialFolders = async () => {
    try {
      setLoading(true);
      const folders = INITIAL_FOLDERS[selectedBucket as keyof typeof INITIAL_FOLDERS] || [];
      
      for (const folder of folders) {
        await adminStorage.createFolder({
          bucket: selectedBucket as any,
          path: folder
        });
      }
      
      showMessage('Initial folders created successfully', 'success');
      loadContents();
    } catch (error) {
      showMessage('Error creating folders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (path: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      setLoading(true);
      await adminStorage.delete(selectedBucket, [path]);
      showMessage('Item deleted successfully', 'success');
      loadContents();
    } catch (error) {
      showMessage('Error deleting item', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      role: 'user' as const,
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Save user message to Supabase
      await supabase.from('chat_history').insert([userMessage]);

      // Get AI response
      const response = await openaiService.generateChatResponse(
        messages.concat(userMessage),
        userProfile || undefined
      );

      const assistantMessage = {
        role: 'assistant' as const,
        content: response || 'I apologize, but I was unable to generate a response.',
        timestamp: new Date()
      };

      // Save assistant message to Supabase
      await supabase.from('chat_history').insert([assistantMessage]);

      setMessages(prev => [...prev, assistantMessage]);

      // Check if the message is requesting a learning plan
      if (input.toLowerCase().includes('learning plan') || 
          input.toLowerCase().includes('study plan')) {
        const plan = await openaiService.generateLearningPlan(
          userProfile || {},
          4 // 4-week plan
        );
        setLearningPlan(plan.weeks || []);
        
        // Save learning plan to Supabase
        await supabase.from('learning_plans').insert([{
          user_id: (await supabase.auth.getUser()).data.user?.id,
          plan: plan.weeks,
          created_at: new Date()
        }]);
      }
    } catch (error) {
      console.error('Error in chat interaction:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but an error occurred. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Storage Manager</h1>
      
      {/* Bucket Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select Bucket:</label>
        <select
          className="w-full p-2 border rounded"
          value={selectedBucket}
          onChange={(e) => setSelectedBucket(e.target.value)}
        >
          {buckets.map(bucket => (
            <option key={bucket} value={bucket}>{bucket}</option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">
          <Upload size={20} />
          Upload File
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*,.pdf,.doc,.docx,.ppt,.pptx"
          />
        </label>

        <button
          onClick={createInitialFolders}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <FolderPlus size={20} />
          Create Initial Folders
        </button>

        <button
          onClick={loadContents}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          <RefreshCw size={20} />
          Refresh
        </button>
      </div>

      {/* Status Message */}
      {message && (
        <div className={`p-4 mb-6 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Content List */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h2 className="font-semibold">Contents</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : contents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No items found</div>
        ) : (
          <ul className="divide-y">
            {contents.map((item) => (
              <li key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                <span>{item.name}</span>
                <button
                  onClick={() => handleDelete(`${currentPath}/${item.name}`)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={20} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}; 