declare global {
    namespace NodeJS {
        interface ProcessENV {
            NEXTAUTH_URL: string;
            NODE_ENV: 'development' | 'production';
            PORT?: string;
            NEXTAUTH_SECRET: string;
        }
    }
}