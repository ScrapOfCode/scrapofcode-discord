import type { Request, Response, Express } from "express";

type ApiRequestType = "get" | "post" | "put" | "delete" | "patch";
type ApiRequest = {
    type: ApiRequestType,
    endpoint: string,
    callback: (
        req: Request, 
        res: Response 
    ) => Promise<void>
};

export async function createExpressRoute(express: Express, opts: ApiRequest){

    const { type, endpoint, callback } = opts;

    switch(type) {
        case "post": {
            express.post(endpoint, async (req, res) => callback(req, res));
            break;
        }
        case "get": {
            express.get(endpoint, async (req, res) => callback(req, res));
            break;
        }
        case "put": {
            express.put(endpoint, async (req, res) => callback(req, res));
            break;
        }
        case "delete": {
            express.delete(endpoint, async (req, res) => callback(req, res));
            break;
        }
        case "patch": {
            express.patch(endpoint, async (req, res) => callback(req, res));
            break;
        }
    }
}