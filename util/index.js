class Util {
    static response(event, statusCode, data) {
        console.log('origin', event.headers.origin);
        return {
            statusCode: statusCode,
            headers: {
                'Access-Control-Allow-Origin': event.headers.origin,
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(data,
                null,
                2
            ),
        };
    }
}
module.exports = Util;