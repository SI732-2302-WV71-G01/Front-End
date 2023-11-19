import http from '../../core/services/http-common';

export class StoresApiService {
    getAll(){
        return http.get('/stores');
    }
    getById(storeId){
        return http.get(`/stores/${storeId}`);
    }
    getAllByUserId(userId) {
        return http.get(`/users/${userId}/stores`);
    }
    add(data){
        return http.post('/stores', data);
    }

    update(id, data){
        return http.put(`/stores/${id}`, data);
    }
    delete(id){
        return http.delete(`/stores/${id}`);
    }
}