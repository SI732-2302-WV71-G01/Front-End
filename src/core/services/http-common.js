import axios from 'axios';
import {storeGlobal} from "@/learning/store/store";

export default axios.create({
   baseURL: 'https://learningcenterapi20231119153224.azurewebsites.net/api/v1',
   headers: {
      'Content-type': 'application/json',
      ...(storeGlobal.user && storeGlobal.user.token
          ? { 'Authorization': `Bearer ${storeGlobal.user.token}` }
          : {})
   }
});


