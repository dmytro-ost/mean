import apiConfig from './default.json';

interface Config {
  baseUrl: string;
  environment: string;
}

if (!apiConfig.baseUrl || apiConfig.baseUrl === '/') {
  apiConfig.baseUrl = window.location.origin;
}

export default apiConfig as Config;
