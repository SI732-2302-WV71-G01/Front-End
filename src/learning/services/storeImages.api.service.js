import http from '../../core/services/http-common';

export class StoreImagesApiService {
    getAllByStoreId(storeId) {
        return http.get(`/stores/${storeId}/storeimages`);
    }
    add(data) {
        return http.post('/storeimages', data);
    }
    //Agregar en el backend
    delete(id){
        return http.delete(`/storeimages/${id}`);
    }
}