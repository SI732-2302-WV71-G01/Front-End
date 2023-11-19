import axios from 'axios';
import {storeGlobal} from "@/learning/store/store";

export default axios.create({
   baseURL: 'https://localhost:44396/api/v1',
   headers: {
      'Content-type': 'application/json',
      ...(storeGlobal.user && storeGlobal.user.token
          ? { 'Authorization': `Bearer ${storeGlobal.user.token}` }
          : {})
   }
});


