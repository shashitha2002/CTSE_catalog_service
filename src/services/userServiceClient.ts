import axios from "axios";
import 'dotenv/config'
import { token } from "morgan";

const API_GATEWAY_URL = process.env.API_GATEWAY_URL || "http://localhost:8080";

export interface VerifyUserResponse {
    "isAdmin": boolean
}

export interface UserRoleCheckResponse {
    "isAdmin": false,
    "role": string
}

export const verifyUser = async (userId: string): Promise<VerifyUserResponse> => {
    try {
        const response = await axios.get<VerifyUserResponse>(
            `${API_GATEWAY_URL}/users/${userId}/verify`
        );
        console.log(response.data);
        return response.data;

    } catch (error: any) {
        if (error.response?.status === 404) {
            return {"isAdmin": false};
        }
        throw new Error(`User Service unavailable: ${error.message}`);
    }
};

export const  userRoleCheck = async (token: string): Promise<UserRoleCheckResponse> => {
    try{
        const response = await axios.get<UserRoleCheckResponse>(`${API_GATEWAY_URL}/users/me/admin`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });
        console.log("admin data",response.data);
        return response.data;

    }catch(error: any){
        if (error.response?.status === 404) {
            return {"isAdmin": false, "role": "user"};
        }
        throw new Error(`User Service unavailable: ${error.message}`);
    }
}

/**
 * Returns true only if the user exists AND has role 'admin'
 */
export const isAdmin = async (userId: string): Promise<boolean> => {
    const result = await verifyUser(userId);
    return result.isAdmin;
};