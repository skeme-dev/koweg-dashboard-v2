import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ params, url }) => {
    const userId = url.searchParams.get('uid');
    return { token: params.token, uid: userId };
};

export const actions = {
    changePassword: async ({ locals, params, request }) => {
        const formData = await request.formData();
        const { token } = params;


        if (!token) {
            return fail(400, { message: 'Missing token' });
        }

        const password = formData.get('password') as string;
        const passwordConfirm = formData.get('passwordConfirm') as string;
        const uid = formData.get('uid') as string;

        if (!password || !passwordConfirm) {
            return fail(400, { message: 'Missing password or password confirmation failed' });
        }

        if (password.length < 8) {
            return { error: 'Passwort muss mindestens 8 Zeichen lang sein' };
        }

        if (password !== passwordConfirm) {
            return { error: 'Passwörter stimmen nicht überein' };
        }

        try {
            await locals.pb.collection('users').confirmPasswordReset(token,
                password, passwordConfirm);
            await locals.pb.collection('users').update(uid, {
                invited: true,
            });
        } catch (error) {
            console.error(error);
            return { error: 'Fehler beim Zurücksetzen des Passworts.' };
        }
        return redirect(303, '/login');
    }
};