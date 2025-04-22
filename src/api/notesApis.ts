import { endPoints } from './endPoints';
import api from './genericApis';


//types

interface AddNotes {
  content: string;
}

interface DeleteNotes {
  noteIds: Array<string>;
}


export const getAllNotes = async (page: number, limit: number = 10) => {
  try {
    const response = await api.get(
      `${endPoints.getAllNotes}?limit=${limit}&page=${page}`,
    );
    return response?.data;
  } catch (error: object | any) {
    // throw error;
  }
};



export const addNote = async (notesData: AddNotes) => {
  try {
    const response = await api.post(endPoints.getAllNotes, notesData);
    return response?.data;
  } catch (error: object | any) {
    // throw error;
  }
};

export const editNote = async (notesId: string, notesData: AddNotes) => {
  try {
    const response = await api.put(
      `${endPoints.getAllNotes}/${notesId}`,
      notesData,
    );
    return response?.data;
  } catch (error: object | any) {
    // throw error;
  }
};


export const deleteNote = async (notesData: DeleteNotes) => {
  try {
    const response = await api.put(`${endPoints.deleteNote}`, notesData);
    return response?.data;
  } catch (error: object | any) {
    // throw error;
  }
};
