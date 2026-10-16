/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_COLLEGE_NAME?: string;
  readonly VITE_DEMO_MODE?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_WHATSAPP_NUMBER?: string;
  readonly VITE_MAP_EMBED_URL?: string;
  readonly VITE_ERP_URL?: string;
  readonly VITE_LMS_URL?: string;
  readonly VITE_RESULTS_URL?: string;
  readonly VITE_APPLICATION_PORTAL_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
