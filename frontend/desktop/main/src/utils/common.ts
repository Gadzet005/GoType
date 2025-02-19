/**
 * Returns a function that ignores an error with a specific code.
 *
 * @param code - The error code to be ignored.
 * @returns A function that takes an error object and throws
 *          it unless the error code matches the specified code.
 */
export function ignoreCode(code: string) {
    return (err: any) => {
        if (code === err.code) {
            return;
        }
        throw err;
    };
}

/**
 * Returns a function that logs an error message and the error object to the console.
 *
 * @param msg - The message to log before the error.
 * @returns A function that takes an error object,
 *          logs the message and error, and then throws the error.
 */
export function logError(msg: string) {
    return (err: any) => {
        console.error(msg);
        console.error(err);
        throw err;
    };
}
