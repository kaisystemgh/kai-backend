import { ServiceAccount } from 'firebase-admin';

interface ServiceAccountCustom extends ServiceAccount {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain: string;
}

export const getFirebaseConfig = (env): ServiceAccountCustom => ({
  type: env.FIREBASE_TYPE,
  project_id: env.FIREBASE_PROJECT_ID,
  private_key_id: env.FIREBASE_PRIVATE_KEY_ID,
  private_key: JSON.parse(env.FIREBASE_PRIVATE_KEY).privateKey,
  client_email: env.FIREBASE_CLIENT_EMAIL,
  client_id: env.FIREBASE_CLIENT_ID,
  auth_uri: env.FIREBASE_AUTH_URI,
  token_uri: env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: env.FIREBASE_UNIVERSE_DOMAIN,
});
