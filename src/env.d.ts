declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NOTION_TOKEN: string;
      CORS_ORIGIN: string;
      PORT: string;
      DATABASE_ID_CLONE: string;
    }
  }
}

export {};
