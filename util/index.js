class Util {
    static response(statusCode, data) {
        return {
            statusCode: statusCode,
            headers: {
                'Access-Control-Allow-Origin': '*',
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