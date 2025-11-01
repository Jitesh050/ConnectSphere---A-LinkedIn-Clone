import { User, Post } from '../types';

// Define the shape of credentials and signup data
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

// Set a base URL for the API. This should point to the backend server.
const API_BASE_URL = '/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'An unknown error occurred');
  }
  // Handle cases with no content
  if (response.status === 204) {
    return null;
  }
  return response.json();
};

// --- Auth API ---

export const signup = async (data: SignupData): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    const { user, token } = await handleResponse(response);
    if (token) localStorage.setItem('authToken', token);
    return user;
};

export const login = async (credentials: LoginCredentials): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    const { user, token } = await handleResponse(response);
    if (token) localStorage.setItem('authToken', token);
    return user;
};

export const logout = () => {
  localStorage.removeItem('authToken');
};

export const getCurrentUser = async (): Promise<User | null> => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.status === 401) { // Unauthorized or token expired
            logout();
            return null;
        }
        return await handleResponse(response);
    } catch (error) {
        console.error("Failed to fetch current user:", error);
        logout();
        return null;
    }
};

// --- Post API ---

// Helper to get auth headers with FormData support
const getAuthHeaders = (isFormData = false) => {
    const token = localStorage.getItem('authToken');
    const headers: HeadersInit = {
        'Authorization': `Bearer ${token}`,
    };
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }
    return headers;
};


export const getPosts = async (): Promise<Post[]> => {
    const response = await fetch(`${API_BASE_URL}/posts`);
    return handleResponse(response);
};

export const createPost = async ({ text, imageFile }: { text: string, imageFile?: File }): Promise<Post> => {
    const formData = new FormData();
    formData.append('text', text);
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: getAuthHeaders(true), // Let browser set Content-Type for FormData
        body: formData,
    });
    return handleResponse(response);
};

export const updatePost = async (postId: string, { text }: { text: string }): Promise<Post> => {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ text }),
    });
    return handleResponse(response);
};

export const deletePost = async (postId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || 'Failed to delete post');
    }
};

export const toggleLike = async (postId: string): Promise<Post> => {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
        method: 'POST',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};


// --- User API ---
export const getUser = async (userId: string): Promise<User | undefined> => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`);
        return handleResponse(response);
    } catch (error) {
        console.error(`Failed to fetch user ${userId}:`, error);
        return undefined;
    }
};

export const getPostsByUser = async (userId: string): Promise<Post[]> => {
    const response = await fetch(`${API_BASE_URL}/posts/user/${userId}`);
    return handleResponse(response);
};
