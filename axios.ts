import axios from "axios";

export default axios.create({
    baseURL: "http://192.168.11.70:8080",
});