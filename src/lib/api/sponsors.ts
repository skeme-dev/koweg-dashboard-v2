import { sendFormData } from "./helpers";

export function createSponsor(data: any, cb: () => any, onError: (error: Error) => any) {
    // const validation = departmentSchema.safeParse(data);

    // if (!validation.success) {
    // 	return onError(new Error(validation.error.message));
    // }

    sendFormData('/sponsors?/createSponsor ', data)
        .then(() => {
            return cb();
        })
        .catch((error) => {
            return onError(error);
        });
}

export function updateSponsor(data: any, cb: () => any, onError: (error: Error) => any) {
    // const validation = departmentSchema.safeParse(data);

    // if (!validation.success) {
    // 	return onError(new Error(validation.error.message));
    // }

    sendFormData('/sponsors?/updateSponsor ', data)
        .then(() => {
            return cb();
        })
        .catch((error) => {
            return onError(error);
        });
}

export function deleteSponsor(id: string, cb: () => any, onError: (error: Error) => any) {
    sendFormData('/sponsors?/deleteSponsor ', { id })
        .then(() => {
            return cb();
        })
        .catch((error) => {
            return onError(error);
        });
}