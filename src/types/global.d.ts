/* eslint-disable @typescript-eslint/no-explicit-any */

export {};

declare global {
  interface Window {
    _env_: {
      GITHUB_URL: string;
      GITHUB_BUTTON_LABLE: string;  
      [key: string]: any;
    };
  }
}
