import axios from "axios";
import 'dotenv/config'

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;

export interface VerifyUserResponse {
    "isAdmin": boolean
}
export const verifyUser = async (userId: string): Promise<VerifyUserResponse> => {
    try {
        const response = await axios.get<VerifyUserResponse>(
            `${USER_SERVICE_URL}/users/${userId}/verify`
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

/**
 * Returns true only if the user exists AND has role 'admin'
 */
export const isAdmin = async (userId: string): Promise<boolean> => {
    const result = await verifyUser(userId);
    return result.isAdmin;
};