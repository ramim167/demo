import { FirebaseEndpointConfig } from "@/lib/types";

// Fill these endpoints later when you connect Firebase auth, Firestore, Storage,
// or your own custom middleware. The app already works locally without them.
export const firebaseEndpoints: FirebaseEndpointConfig = {
  signIn: "",
  signUp: "",
  refreshSession: "",
  productSync: ""
};

export async function postToConfiguredEndpoint<TResponse = unknown>(
  endpoint: string,
  payload: unknown
) {
  if (!endpoint) {
    return null as TResponse | null;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Remote endpoint failed: ${response.status}`);
  }

  return (await response.json()) as TResponse;
}
