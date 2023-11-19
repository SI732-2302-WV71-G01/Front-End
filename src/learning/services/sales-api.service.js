import http from '../../core/services/http-common';
import { storeGlobal } from '../store/store'
export class SalesApiService {
    add(data){
        return http.post(`/sales`, data);
    }
    delete(saleId){
        return http.delete(`/sales/${saleId}`);
    }
    addProductToSale(form) {
        return http.post(`/sales/addproducttosale`, form);
    }
    getAllByStoreId(storeId){
        return http.get(`/store/${storeId}/sales`);
    }
}