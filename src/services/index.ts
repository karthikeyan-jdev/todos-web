export default async function ApiFetcher({
  method = "GET",
  url,
  headers = {},
  body,
}: {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  headers?: Record<string, string>;
  body?: any;
}) {
  const response = await fetch(url, {
    method: method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401) {
    localStorage.clear();
    window.location.href = "/login";
    return;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}
