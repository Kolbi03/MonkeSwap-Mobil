import axios from "axios";
import BaseUrl from "./baseURL/baseURL";

export default axios.create({
    baseURL: BaseUrl,
});