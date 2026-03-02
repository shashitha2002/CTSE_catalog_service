import type {Request, Response, NextFunction} from 'express';
import axios from 'axios';

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    // --- MOCK MODE (Use this until User Service is ready) ---
    if (process.env.NODE_ENV === 'development') {
        console.log("Mock Auth: Bypassing User Service check...");
        return next();
    }

    // --- REAL MODE (The Actual Assignment Requirement) ---
    try {
        // Calling the API Gateway to reach the User Service
        const response = await axios.get(`${process.env.GATEWAY_URL}/api/users/verify-admin`, {
            headers: { Authorization: authHeader }
        });

        if (response.data.isAdmin) {
            next();
        } else {
            res.status(403).json({ message: 'Requires Admin Role' });
        }
    } catch (error) {
        res.status(500).json({ message: 'User Service unreachable' });
    }
};