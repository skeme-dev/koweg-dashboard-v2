// place files you want to import through the `$lib` alias in this folder.

export function getPermissionsByUserId(userId: string, permissions: any[]) {

    if (!userId) return;
    
    return permissions.filter(permission => {
        if (Array.isArray(permission.users)) {
            return permission.users.includes(userId);
        } else {
            return permission.users === userId;
        }
    });

}