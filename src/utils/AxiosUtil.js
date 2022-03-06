// import axios from "axios";
//
// export default {
//     axiosGetDataFromApi(apiName, parameters = {}, callbackFunction = () => undefined) {
//         this.axiosGet(getUrl.getApi()[apiName], parameters, (response) => {
//             this.apiData[apiName] = response.data;
//             callbackFunction(response);
//         });
//     },
//     axiosGet(url, parameters = {}, handler = () => {
//         return undefined;
//     }) {
//         this.isLoading = true;
//         for (const parametersKey in parameters) {
//             let _value = parameters[parametersKey];
//             if (url.indexOf("?") === -1) {
//                 url += "?";
//             }
//             if (Array.isArray(_value)) {
//                 for (const valueElement of _value) {
//                     if (_value) {
//                         url += `${parametersKey}=${valueElement}&`;
//                     }
//                 }
//             } else {
//                 if (_value) {
//                     url += `${parametersKey}=${_value}&`;
//                 }
//             }
//         }
//         axios.get(url).then(
//             response => {
//                 handler(response);
//                 // console.log(url, response.data);
//                 this.isLoading = false;
//             },
//             error => {
//                 console.warn(error.message);
//                 this.isLoading = false;
//             },
//         );
//     },
// }