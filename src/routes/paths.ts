export const paths = {
    root: '/',
    login: '/login',
    register: '/register',
    dashboard: '/dashboard',
    auditoria: '/auditoria',
    perfil: '/perfil',
    configuracoes: '/configuracoes',
    notFound: '*',
} as const;

export type PathKeys = keyof typeof paths;