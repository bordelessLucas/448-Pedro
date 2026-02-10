export const paths = {
    root: '/',
    login: '/login',
    register: '/register',
    dashboard: '/dashboard',
    auditoria: '/auditoria',
    notFound: '*',
} as const;

export type PathKeys = keyof typeof paths;