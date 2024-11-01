import prismic from '@prismicio/client'
import getAppConfig from './app-config'

const getPrismicClient = () => {
    const config = getAppConfig();
    const client = prismic.createClient(config.prismic.repositoryName);

    return client;
};

export default getPrismicClient;