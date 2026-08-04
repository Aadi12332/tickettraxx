type ApiErrorResponse = {
  error?: {
    message?: unknown;
  };
};

export const hasInvalidOrExpiredTokenError = async (response: Response) => {
  if (response.ok) return false;

  const payload = (await response
    .clone()
    .json()
    .catch(() => null)) as ApiErrorResponse | null;

  return payload?.error?.message === "Invalid or expired token";
};
