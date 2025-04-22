export const REQUEST_FAILED =
  'Request failed. Please check your connection and try again.';
export const SERVER_ERROR =
  'Server encountered an error. Please try again later.';
export const SERVER_NO_RESPONSE =
  'No response from the server. Please check your network connection.';
export const SERVER_STATUS_CODE = (status: string) =>
  `Server returned status code: ${status}`;
export const SERVER_TIMEOUT_ERROR = 'Server timeout. Please try again later.';
export const SOMETHING_WENT_WRONG = 'Something went wrong. Please try again.';

export const GET_ERROR = (url: string, message: string) =>
  `GET request failed for ${url}: ${message || 'Unknown error'}`;
export const POST_ERROR = (url: string, message: string) =>
  `POST request failed for ${url}: ${message || 'Unknown error'}`;
export const PUT_ERROR = (url: string, message: string) =>
  `PUT request failed for ${url}: ${message || 'Unknown error'}`;
export const DELETE_ERROR = (url: string, message: string) =>
  `DELETE request failed for ${url}: ${message || 'Unknown error'}`;
