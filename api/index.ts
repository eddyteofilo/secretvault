import { startServer } from '../src/app';

let cachedApp: any = null;

export default async function handler(req: any, res: any) {
    if (!cachedApp) {
        process.env.NODE_ENV = 'production';
        cachedApp = await startServer();
    }
    return cachedApp(req, res);
}
