import { Sequelize } from "sequelize";

//To connect to database...acts as ORM
const sequelize = new Sequelize('test', 'postgres', 'Sharad@0101', {
  host: 'localhost',
  dialect:'postgres'
});

const connection=async()=>{
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync();
        sequelize.sync(/*{ logging: console.log }*/)
        console.log("database synced")
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}


export {
    sequelize,
    connection
  };