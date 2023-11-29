var mysql = require("mysql2")

module.exports = function(){
    return mysql.createConnection({
       host: "127.0.0.1",
        user: "root",
        password: "@ITB123456",
        database: "cardapio",
        port: "3306"
    });

};
