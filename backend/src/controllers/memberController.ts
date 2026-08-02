import type { Request, Response } from "express";
import memberService from "../services/memberService.js";

async function getMembersByServer(req: Request, res: Response) {
    try {
        const serverId = Number(req.params.serverId);

        if (isNaN(serverId)) {
            return res.status(400).json({
                message: "Invalid server id"
            });
        }

        const members = await memberService.getMembersByServer(serverId);

        return res.status(200).json(members);
    
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export default {
    getMembersByServer
}