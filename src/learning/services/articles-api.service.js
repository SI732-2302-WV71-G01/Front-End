import http from '../../core/services/http-common';

export class ArticlesApiService {
    getAll(){
        return http.get(`/articles`);
    }
    getAllByUserId(userId) {
        return http.get(`/users/${userId}/articles`);
    }
    add(data){
        return http.post(`/articles`, data);
    }
    update(articleId, data){
        return http.put(`/articles/${articleId}`, data);
    }
    delete(articleId){
        return http.delete(`/articles/${articleId}`);
    }
}