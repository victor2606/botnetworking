module.exports = (bot) => {
    bot
    .use(async (ctx, next) => {
        try { await next(); }
        catch (error) {
            if (error.status === 400) console.log('Bad Request: The request was invalid or cannot be otherwise served.');
            else if (error.status === 401) console.log('Unauthorized: Authentication failed or user does not have permissions for the requested operation.');
            else if (error.status === 403) console.log('Forbidden: The request is valid, but the server is refusing to respond to it.');
            else if (error.status === 404) console.log('Not Found: The requested resource could not be found.');
            else if (error.status === 409) console.log('Conflict: The request could not be completed due to a conflict with the current state of the resource.');
            else if (error.status === 429) console.log('Too Many Requests: The user has sent too many requests in a given amount of time.');
            else if (error.status === 500) console.log('Internal Server Error: An unexpected condition was encountered by the server.');
            else console.log('An unexpected error has occurred.', error);
        }
    });
}