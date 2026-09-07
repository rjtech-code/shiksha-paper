/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL for the backend API when it's deployed separately from the frontend
   *  (e.g. "https://sikshapaper-api.onrender.com"). Leave unset for same-origin/relative calls. */
  readonly VITE_API_BASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
