import ApiModel from '../apiModel';

export default class Company extends ApiModel{
    get primaryKey() {
        return "id";
    }

    static get(id) {
        return this.callAPI(`company/companies/${id}/`);
    }

    get(id) {
        return this.api
            .get(`company/companies/${id}/`)
            .then(group => {
                if(group) {
                    group.id = id;
                }
        
                return this.wrapResponse(group);
            });
    }

    search(params)
} 