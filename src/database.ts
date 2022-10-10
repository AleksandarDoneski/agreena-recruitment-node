import { Sequelize, DataTypes, Model } from 'Sequelize';

const sequelize = new Sequelize('sqlite::memory:');

export class User extends Model {}
export class Auth_Token extends Model {}
export class Country extends Model {}
export class Status extends Model {}
export class Carbon_Certificate extends Model {}

User.init({
    ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'User'
});

Status.init({
    ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    Value: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Status'
})

Auth_Token.init({
    ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    Token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Auth_Token'
})

Country.init({
    ID: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    Value: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Country'
})

Carbon_Certificate.init({
    ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    Country: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Country,
            key: 'ID',
        }
    },
    Status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 1,
        references: {
            model: Status,
            key: 'ID'
        }
    },
    Owner: {
        type: DataTypes.INTEGER,
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


export async function intilizeDb() {

    await Country.sync();
    await Status.sync();
    await User.sync();
    await Carbon_Certificate.sync();

    await Country.bulkCreate([
        { ID: 'MK', Value: 'Macedonia'},
        { ID: 'UK', Value: 'United Kingdom'},
        { ID: 'FR', Value: 'France'},
    ])

    await Status.bulkCreate([
        {Value: 'available'},
        {Value: 'owned'},
        {Value: 'transferred '}
    ])

    const bulkInsert = [];
    const countries = ['MK', 'FR', 'UK'];
    const randomCountry = Math.floor(Math.random() * (2));
    for (let i = 1; i <= 100; i++) {
        bulkInsert.push({
            Country: countries[randomCountry],
        })
    }
    await Carbon_Certificate.bulkCreate(bulkInsert);

    const insertUsers = [];
    for (let i = 1; i <= 10; i++) {
        insertUsers.push({
            Name: `MockUser${i}`,
            Username: `mockemail${i}@email.com`,
            Password: `mockpassword${i}`,
        })
    }
    await User.bulkCreate(insertUsers);

    for(let i = 1; i <= 5; i++) {
        const randomId = Math.floor(Math.random() * 100) + 1;
        await Carbon_Certificate.update({
            'Status': 2,
            'Owner': i
        }, {'where': {'ID': randomId}})
    }

    console.log('Databse intilized...');

}
