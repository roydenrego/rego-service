class Util {
    static response(statusCode, data) {
        return {
            statusCode: statusCode,
            body: JSON.stringify(data,
                null,
                2
            ),
        };
    }
}
module.exports = Util;