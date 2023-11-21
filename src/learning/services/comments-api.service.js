import http from '../../core/services/http-common';

export class CommentsApiService {

    getAllByArticleId(articleId) {
        return http.get(`/articles/${articleId}/comments`);
    }
    getAllByStoreId(storeId) {
        return http.get(`/stores/${storeId}/comments`);
    }
    add(data){
        return http.post(`/comments`, data);
    }
    update(commentId, data){
        return http.put(`/comments/${commentId}`, data);
    }
    delete(commentId){
        return http.delete(`/comments/${commentId}`);
    }
}