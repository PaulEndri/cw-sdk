import axios from 'axios';
import env   from '../env/env';

const API_ROOT = env.cw_url;
const API_VRSN = env.version
const HEADER   = {
    'Authorization': [
        'Base ',
        env.company_id,
        '+',
        env.cw_pub_key,
        ':',
        env.cw_private_key
    ].join(''),
    'Content-Type' : 'application/json'
};

export default class Api {
    static get(route, cache) {
        return new Promise((resolve, reject) => {
            if(cache.get(route)) {
                return resolve(route);
            }

            axios({
                baseURL: `https://${API_ROOT}/`,
                headers: HEADER,
                url:     `${API_VRSN}/apis/3.0/${route}`
            })
                .then(response => {
                    if (response.status !== 200) {
                        reject(response.data);
                    } else {
                        cache.set(route, response.data, 60);
                        resolve(response.data);
                    }
                })
                .catch(e => {
                    console.log(e);
                    reject(e);
                })
        })
    }

}
