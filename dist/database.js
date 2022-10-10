"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intilizeDb = exports.Carbon_Certificate = exports.Status = exports.Country = exports.Auth_Token = exports.User = void 0;
const Sequelize_1 = require("Sequelize");
const sequelize = new Sequelize_1.Sequelize('sqlite::memory:');
class User extends Sequelize_1.Model {
}
exports.User = User;
class Auth_Token extends Sequelize_1.Model {
}
exports.Auth_Token = Auth_Token;
class Country extends Sequelize_1.Model {
}
exports.Country = Country;
class Status extends Sequelize_1.Model {
}
exports.Status = Status;
class Carbon_Certificate extends Sequelize_1.Model {
}
exports.Carbon_Certificate = Carbon_Certificate;
User.init({
    ID: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    Name: {
        type: Sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    Username: {
        type: Sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    Password: {
        type: Sequelize_1.DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'User'
});
Status.init({
    ID: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    Value: {
        type: Sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Status'
});
Auth_Token.init({
    ID: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    Token: {
        type: Sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Auth_Token'
});
Country.init({
    ID: {
        type: Sequelize_1.DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    Value: {
        type: Sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Country'
});
Carbon_Certificate.init({
    ID: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    Country: {
        type: Sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: Country,
            key: 'ID',
        }
    },
    Status: {
        type: Sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 1,
        references: {
            model: Status,
            key: 'ID'
        }
    },
    Owner: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'ID',
        }
    }
}, {
    sequelize,
    modelName: 'Carbon_Certificate'
});
async function intilizeDb() {
    await Country.sync();
    await Status.sync();
    await User.sync();
    await Carbon_Certificate.sync();
    await Country.bulkCreate([
        { ID: 'MK', Value: 'Macedonia' },
        { ID: 'UK', Value: 'United Kingdom' },
        { ID: 'FR', Value: 'France' },
    ]);
    await Status.bulkCreate([
        { Value: 'available' },
        { Value: 'owned' },
        { Value: 'transferred ' }
    ]);
    const bulkInsert = [];
    const countries = ['MK', 'FR', 'UK'];
    const randomCountry = Math.floor(Math.random() * (2));
    for (let i = 1; i <= 100; i++) {
        bulkInsert.push({
            Country: countries[randomCountry],
        });
    }
    await Carbon_Certificate.bulkCreate(bulkInsert);
    const insertUsers = [];
    for (let i = 1; i <= 10; i++) {
        insertUsers.push({
            Name: `MockUser${i}`,
            Username: `MockUsername${i}`,
            Password: `MockPassword${i}`,
        });
    }
    await User.bulkCreate(insertUsers);
    for (let i = 1; i <= 5; i++) {
        const randomId = Math.floor(Math.random() * 100) + 1;
        await Carbon_Certificate.update({
            'Status': 2,
            'Owner': i
        }, { 'where': { 'ID': randomId } });
    }
    console.log('Databse intilized...');
}
exports.intilizeDb = intilizeDb;
