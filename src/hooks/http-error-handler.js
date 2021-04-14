import { useState, useEffect } from "react";

export default (httpClient) => {
  const [error, setError] = useState(null);

  const requestInterceptor = httpClient.interceptors.request.use((request) => {
    setError(null);
    return request;
  });

  const responseInterceptor = httpClient.interceptors.response.use(
    (response) => response,
    (errorResponse) => {
      setError(errorResponse);
    }
  );

  useEffect(() => {
    httpClient.interceptors.request.eject(requestInterceptor);
    httpClient.interceptors.request.eject(responseInterceptor);
  }, [requestInterceptor, responseInterceptor]);

  const errorConfirmedHandler = () => {
    setError(null);
  };

  // Se puede devolver cualquier cosa o nada
  return [error, errorConfirmedHandler];
};
