import axios from "axios";
import { env } from "../../config/env";

export const xenditClient = axios.create({
    baseURL: "https://api.xendit.co",
    auth: {
        username: env.XENDIT_SECRET_KEY as string,
        password: "",
    },
    headers: {
        "Content-Type": "application/json",
        "api-version": "2022-07-31",
    },
});