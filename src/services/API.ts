import axios from "axios";
//create a post request with the data from the cheque object using fetch
//create base url from environment variable base url

// const BASE_URL = "https://crate-mgt-backend.firstlovegallery.com/public/api/v1";
// const SERVER_URL = "https://crate-mgt-backend.firstlovegallery.com/public";

const BASE_URL = "http://localhost:8000/api/v1";
const SERVER_URL = "http://localhost:8000";

const post = (url: string, data: any, headers: object) => {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
        switch(key) {
            case "products":
            case "product_quanties":
            case "empties_returned":
            case "empties_on_ground_products":
            case "breakages":
            case "saleItems":
                formData.append(key, JSON.stringify(data[key]));
                break;
            default:
                formData.append(key, data[key]);

        }
    });
    
    return axios(BASE_URL+url, {
         method: 'POST',
         headers: {
           'Content-Type': '"application/json"',
           ...headers,
         },
         data: formData
       });
   }

const postWithFile = (url: string, data: any, headers: object) => {
 const formData = new FormData();
 
 Object.keys(data).forEach(key => {
  formData.append(key, data[key]);
 });
 
 return axios(BASE_URL+url, {
      method: 'POST',
      headers: {
        'Content-Type': '"multipart/form-data"',
        'Accept': 'application/json',
        ...headers,
      },
      data: formData
    });
}

const get = (url: string, headers: object) => {
    
    return axios(BASE_URL+url, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...headers,
        },
    });
}

const deleteRequest = (url: string, headers: object) => {
    return axios(BASE_URL+url, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...headers,
        },
    });
}

const put = (url: string, data: any, headers: object) => {
    return axios(BASE_URL+url, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...headers,
        },
        data: data
    });
}

const auth = (url: string, data: any, headers: object) => {
    return axios(BASE_URL+url, {
        method: 'POST',
        headers: {
            'Content-Type': '"application/json"',
            'Accept': 'application/json',
            ...headers,
        },
        data: JSON.stringify(data)
    });
}


export { post, postWithFile, get, deleteRequest, put, auth, SERVER_URL };