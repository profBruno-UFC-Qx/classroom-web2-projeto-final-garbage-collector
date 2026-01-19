import { AxiosError } from 'axios';

interface BackendErrorResponse {
  message: string;
  errors?: string[];
  status?: string;
}

export const getErrorMessage = (error: unknown, defaultMessage: string = 'Ocorreu um erro inesperado.'): string => {
  if (!error) return defaultMessage;

  if (isAxiosError(error) && error.response?.data) {
    const data = error.response.data as BackendErrorResponse;

    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors[0] ?? defaultMessage;
    }

    if (data.message) {
      return data.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return defaultMessage;
};

function isAxiosError(payload: any): payload is AxiosError {
  return payload && typeof payload === 'object' && 'isAxiosError' in payload;
}
