import Client from "../utils/discord/client";
import getPrismicClient from "../utils/prismic";

export const listArticleExpressRoute = (client: Client) => client.expressRoute({
    type: "get",
    endpoint: "/api/articles",
    callback: async (req, res) => {
        const client = getPrismicClient();
        const documentType = "blog_article"

        try {
            const jsonResponse = await client.getByType(documentType);
            const objectResponse = jsonResponse.results.map((result) => ({
                title: result.data.title[0].text,
                publishedAt: result.first_publication_date as string,
                cover: { url: result.data.cover.url },
                content: result.data.content[0].text || result.data.content[1].text
            }));

            res.json({ data: objectResponse });
        } catch (error) {
            console.error("Error fetching articles:", error);
            res.status(500).json({ error: "Failed to fetch articles." });
        }
    }
});

