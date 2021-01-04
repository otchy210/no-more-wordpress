import mysql from 'mysql';

class MySql {
    constructor(connection) {
        this.connection = connection;
    }

    connect() {
        this.connection.connect();
    }

    query(statement) {
        return new Promise((resolve, reject) => {
            this.connection.query(statement, (error, results, fields) => {
                if (error) {
                    reject(error);
                    return;
                };
                resolve({results, fields});
            });
        });
    }

    end() {
        this.connection.end();
    }
}

export const newConnection = (config) => {
    const connection = mysql.createConnection(config);
    const instance = new MySql(connection);
    return instance;
};