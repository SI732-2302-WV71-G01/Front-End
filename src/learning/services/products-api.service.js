import http from '../../core/services/http-common';
import { storeGlobal } from '../store/store'
export class ProductsApiService {
    add(data){
        return http.post(`/products`, data);
    }
    getAllByStoreId(storeId) {
        return http.get(`/stores/${storeId}/products`);
    }
    update(productId, data){
        return http.put(`/products/${productId}`, data);
    }
    delete(productId){
        return http.delete(`/products/${productId}`);
    }
}