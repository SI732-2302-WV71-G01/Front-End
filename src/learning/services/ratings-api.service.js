import http from '../../core/services/http-common';

export class RatingsApiService {

    getByStoreIdAndUserId(storeId, userId){
        return http.get(`/ratings/${storeId}/${userId}`);
    }
    getAllByStoreId(storeId) {
        return http.get(`/stores/${storeId}/ratings`);
    }
    add(data){
        return http.post('/ratings', data);
    }

    update(id, data){
        return http.put(`/ratings/${id}`, data);
    }
    delete(id){
        return http.delete(`/ratings/${id}`);
    }
}