import { EventFormData, EventFormDataApi } from '../screens/homeStack/scheduleEvent/types';
import { endPoints } from './endPoints';
import api from './genericApis';

export const getAllEvents = async (businessId: string, month: string) => {
  try {
    const response = await api.get(`${endPoints.getAllEvents}`, {
      businessId: businessId,
      month: month,
      mobile: true,
    });
    return response?.data;
  } catch (error: object | any) {
    // throw error;
  }
};
export const getUserNetwork = async (page: number, limit: number) => {
  try {
    const response = await api.get(`${endPoints.getUsersNetwork}`, {
      page: page,
      limit: limit,
    });
    return response?.data;
  } catch (error: object | any) {
    // throw error;
  }
};
export const searchNetwork = async (query: string) => {
  try {
    const response = await api.get(`${endPoints.getUsersNetwork}`, {
      q: query,
    });
    return response?.data;
  } catch (error: object | any) {
    // throw error;
  }
};
export const createEvent = async (eventData: EventFormDataApi) => {
  try {
    const response = await api.post(endPoints.createEvent, eventData);
    return response?.data;
  } catch (error: object | any) {
    // throw error;
  }
};
export const updateEvent = async (id: string, eventData: EventFormDataApi) => {
  try {
    const response = await api.put(endPoints.createEvent, eventData, { id: id });
    return response?.data;
  } catch (error: object | any) {
    // throw error;
  }
};
export const acceptEvent = async (id: string) => {
  try {
    const response = await api.post(`${endPoints.acceptReject}${id}`, {
      action: 'join',
    });
    return response?.data;
  } catch (error: object | any) {
    // throw error;
  }
};
export const rejectEvent = async (id: string) => {
  try {
    const response = await api.post(`${endPoints.acceptReject}${id}`, {
      action: 'cancel',
    });
    return response?.data;
  } catch (error: object | any) {
    // throw error;
  }
};
export const deleteEvent = async (eventId: string) => {
  try {
    const response = await api.delete(`${endPoints.createEvent}/${eventId}`);
    return response?.data;
  } catch (error: object | any) {
    // throw error;
  }
};
export const getEventDetail = async (id: string) => {
  try {
    const response = await api.get(`${endPoints.createEvent}/${id}`);
    return response?.data;
  } catch (error: object | any) {
    // throw error;
  }
};
export const getEventHistory = async (eventData: {
  businessId: string;
  date: Date;
}) => {
  try {
    const response = await api.get(endPoints.eventHistory, eventData);
    return response?.data;
  } catch (error: object | any) {
    // throw error;
  }
};
