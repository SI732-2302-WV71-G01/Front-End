import http from '../../core/services/http-common';
export class UsersApiService {
    //POST
    authenticate(data) {
        return http.post('/users/sign-in', data);
    }
    getById(userId){
        return http.get(`users/${userId}`);
    }
    register(data){
        return http.post('users/sign-up', data);
    }

}