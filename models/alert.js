import { DataTypes } from "sequelize";
import { sequelize } from "../postgres/postgres.js";
export const createAlertModel=(tableName,fields)=> {
    //Defining schema of the table
    const attributes=fields.reduce((acc,field)=>{   
        const dataType=field.type ? DataTypes[field.type.toUpperCase()] : DataTypes.STRING;  //This converts provided type into sequelize compatible attributes that is datatype as it wasnt pushing data to table properly
        if(!dataType){
            throw new Error(`Invalid data type: ${field.type} for field: ${field.name}`)
        }

        //creation of the column schema  
         acc[field.name]={                                                 
             type: dataType,
            allowNull: field.allowNull || false,
         };

        return acc;
    },{});
  //after all processes model is ceated using this
    return sequelize.define(tableName,attributes,{  
    },{
        tableName: tableName,
        schema: 'public',
        timestamps: false,
        freezeTableName: true,
    });
};