import { endPoints } from './endPoints';
import api from './genericApis';

//types
interface AddNotes {
  content: string;
}

interface DeleteNotes {
  noteIds: Array<string>;
}

const handleApiError = (error: any, endpoint: string) => {
  const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
  console.error(`API Error [${endpoint}]: ${errorMessage}`);

  return {
    success: false,
    message: errorMessage,
    error: error.response?.data || error,
  };
};

export const getAllNotes = async (page: number, limit: number = 10) => {
  const endpoint = `${endPoints.getAllNotes}?limit=${limit}&page=${page}`;
  try {
    const response = await api.get(endpoint);
    return response?.data;
  } catch (error: any) {
    return handleApiError(error, endpoint);
  }
};

export const addNote = async (notesData: AddNotes) => {
  try {
    const response = await api.post(endPoints.getAllNotes, notesData);
    return response?.data;
  } catch (error: any) {
    return handleApiError(error, endPoints.getAllNotes);
  }
};

export const editNote = async (notesId: string, notesData: AddNotes) => {
  const endpoint = `${endPoints.getAllNotes}/${notesId}`;
  try {
    const response = await api.put(endpoint, notesData);
    return response?.data;
  } catch (error: any) {
    return handleApiError(error, endpoint);
  }
};

export const deleteNote = async (notesData: DeleteNotes) => {
  try {
    const response = await api.put(endPoints.deleteNote, notesData);
    return response?.data;
  } catch (error: any) {
    return handleApiError(error, endPoints.deleteNote);
  }
};