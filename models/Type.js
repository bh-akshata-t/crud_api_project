import { DataTypes} from "sequelize";
import { sequelize } from "../postgres/postgres.js";

export const Type= sequelize.define('Type', { //it is used to define model or table
        // id:{
        //     type: DataTypes.STRING,
        //     primaryKey: true,
        // },
        id:{
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue:DataTypes.UUIDV4,
        },
        
        name: {
            type: DataTypes.STRING,
            allowNull:false,
        },
        fields:{
            type: DataTypes.ARRAY(DataTypes.JSON),
            allowNull:false,
        },
        desc:{
            type: DataTypes.STRING,
        },
    },{
        tableName:'types',
        schema: 'public',
        timestamps: false,
    }
);
