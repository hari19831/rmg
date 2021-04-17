import Axios from 'axios';
import configJson from '../axios/config.json';
const ENV_MODE = configJson.Application.mode;
const ENV_APP = configJson.Application.application;
export const CommonConstants = {
    API_URL: configJson["CommonConstants"][ENV_APP][ENV_MODE]["API_URL"],
    basePath: configJson["CommonConstants"][ENV_APP][ENV_MODE]["Base_path"]
};

export const axios = Axios.create({
    baseURL: CommonConstants.API_URL,
    headers: {
        "Content-Type": "application/json"
    },
});

// axios.interceptors.response.use(response => {
//     return response;
// }, err => {
//     return new Promise((resolve, reject) => {
//         if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
//             this.emit('onAutoLogout', 'Invalid access_token');
//             this.setSession(null);
//         }
//         throw err;
//     });
// });
