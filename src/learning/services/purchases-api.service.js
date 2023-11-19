import http from '../../core/services/http-common';
import { storeGlobal } from '../store/store'
export class PurchasesApiService {
    add(data){
        return http.post(`/purchases`, data);
    }
    delete(purchaseId){
        return http.delete(`/purchases/${purchaseId}`);
    }
    addProductToPurchase(form) {
        return http.post(`/purchases/addproducttopurchase`, form);
    }
    getAllByUserId(userId){
        return http.get(`/users/${userId}/purchases`);
    }
}