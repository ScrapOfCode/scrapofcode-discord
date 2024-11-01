import { databaseClient } from "../database";
import Client from "../utils/discord/client";
import { 
    create as createChangelog,
    remove as removeChangelog,
    update as updateChangelog
} from "../database/table/changelog";

export const createChangelogExpressRoute = (client: Client) => client.expressRoute({
    type: "put",
    endpoint: `/api/changelog/create/:title`,
    callback: async (req, res) => {
        try {
            const title = req.params.title;
            const description = req.body.description as string;
            const version = req.body.version as string;
            const features = req.body.features as Array<{ title: string, description: string }>;

            if(!title || !description || !version || !features || features.length === 0) {
                res.status(400).json({ error: "Brak wymaganych danych." });
            }

            await createChangelog({
                title,
                description,
                version,
                features
            });
        } catch (error) {
            console.error("Błąd podczas tworzenia changelogu:", error);
            res.status(500).json({ error: "Wystąpił błąd podczas tworzenia changelogu." });
        }
    }
});

export const deleteChangelogExpressRoute = (client: Client) => client.expressRoute({
    type: "delete",
    endpoint: `/api/changelog/delete/:id`,
    callback: async (req, res) => {
        try {
            const id = Number(req.params.id);

            if(!id) {
                res.status(400).json({ error: "Brak wymaganych danych." });
            }

            await removeChangelog(id);
        } catch (error) {
            console.error("Błąd podczas tworzenia changelogu:", error);
            res.status(500).json({ error: "Wystąpił błąd podczas tworzenia changelogu." });
        }
    }
});

export const updateChangelogExpressRoute = (client: Client) => client.expressRoute({
    type: "patch",
    endpoint: `/api/changelog/update/:id`,
    callback: async (req, res) => {
        try {
            const id = Number(req.params.id);

            const title = req.body.title as string;
            const description = req.body.description as string;
            const version = req.body.version as string;
            const features = req.body.features as Array<{ title: string, description: string }>;

            if(!id || !title || !description || !version || !features || features.length === 0) {
                res.status(400).json({ error: "Brak wymaganych danych." });
            }

            await updateChangelog(id, {
                title, description, version, features
            });
        } catch (error) {
            console.error("Błąd podczas tworzenia changelogu:", error);
            res.status(500).json({ error: "Wystąpił błąd podczas tworzenia changelogu." });
        }
    }
});

export const getSingleChangelogExpressRoute = (client: Client) => client.expressRoute({
    type: "get",
    endpoint: `/api/changelog/get/:value`,
    callback: async (req, res) => {

    }
});
export const getAllChangelogsExpressRoute = (client: Client) => client.expressRoute({
    type: "get",
    endpoint: `/api/changelog/get/:value`,
    callback: async (req, res) => {
        
    }
});