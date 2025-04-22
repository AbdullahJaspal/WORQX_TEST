import { EventFormDataApi } from '../screens/homeStack/scheduleEvent/types';
import { endPoints } from './endPoints';
import api from './genericApis';


const handleApiError = (error: any, endpoint: string) => {
  const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
  console.error(`API Error [${endpoint}]: ${errorMessage}`);

  return {
    success: false,
    message: errorMessage,
    error: error.response?.data || error,
  };
};

export const getAllEvents = async (businessId: string, month: string) => {
  try {
    const response = await api.get(`${endPoints.getAllEvents}`, {
      businessId: businessId,
      month: month,
      mobile: true,
    });
    return response?.data;
  } catch (error: any) {
    return handleApiError(error, endPoints.getAllEvents);
  }
};

export const getUserNetwork = async (page: number, limit: number) => {
  try {
    const response = await api.get(`${endPoints.getUsersNetwork}`, {
      page: page,
      limit: limit,
    });
    return response?.data;
  } catch (error: any) {
    return handleApiError(error, endPoints.getUsersNetwork);
  }
};

export const searchNetwork = async (query: string) => {
  try {
    const response = await api.get(`${endPoints.getUsersNetwork}`, {
      q: query,
    });
    return response?.data;
  } catch (error: any) {
    return handleApiError(error, endPoints.getUsersNetwork);
  }
};

export const createEvent = async (eventData: EventFormDataApi) => {
  try {
    const response = await api.post(endPoints.createEvent, eventData);
    return response?.data;
  } catch (error: any) {
    return handleApiError(error, endPoints.createEvent);
  }
};

export const updateEvent = async (id: string, eventData: EventFormDataApi) => {
  try {
    const response = await api.put(endPoints.createEvent, eventData, { id: id });
    return response?.data;
  } catch (error: any) {
    return handleApiError(error, `${endPoints.createEvent} (update)`);
  }
};

export const acceptEvent = async (id: string) => {
  const endpoint = `${endPoints.acceptReject}${id}`;
  try {
    const response = await api.post(endpoint, {
      action: 'join',
    });
    return response?.data;
  } catch (error: any) {
    return handleApiError(error, endpoint);
  }
};

export const rejectEvent = async (id: string) => {
  const endpoint = `${endPoints.acceptReject}${id}`;
  try {
    const response = await api.post(endpoint, {
      action: 'cancel',
    });
    return response?.data;
  } catch (error: any) {
    return handleApiError(error, endpoint);
  }
};

export const deleteEvent = async (eventId: string) => {
  const endpoint = `${endPoints.createEvent}/${eventId}`;
  try {
    const response = await api.delete(endpoint);
    return response?.data;
  } catch (error: any) {
    return handleApiError(error, endpoint);
  }
};

export const getEventDetail = async (id: string) => {
  const endpoint = `${endPoints.createEvent}/${id}`;
  try {
    const response = await api.get(endpoint);
    return response?.data;
  } catch (error: any) {
    return handleApiError(error, endpoint);
  }
};

export const getEventHistory = async (eventData: {
  businessId: string;
  date: Date;
}) => {
  try {
    const response = await api.get(endPoints.eventHistory, eventData);
    return response?.data;
  } catch (error: any) {
    return handleApiError(error, endPoints.eventHistory);
  }
};