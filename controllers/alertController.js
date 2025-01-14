// import { Sequelize } from "sequelize";
import { createAlertModel } from "../models/alert.js";
// import { SELECT } from "sequelize/lib/query-types";
import { sequelize } from "../postgres/postgres.js";
import { Type } from "../models/Type.js";

export const createAlerts=async(req,res)=>{
    try{
        const { typeId, alerts}=req.body;

        const type=await Type.findByPk(typeId);

        if(!type) return res.status(404).json({error: 'Type Not Found'});
        //fetch dynamic table name
        const tableName=`${typeId}`; //put uuid instead of character varying

        //Will create alert table if it doesn't exist
        const alertModel=createAlertModel(tableName,type.fields);
        await alertModel.sync();

        //Insert Alerts
        await alertModel.bulkCreate(alerts);
        return res.status(201).json({message:'Alerts created Successfully'});
    }catch(error){
        console.error('Error creating alerts:',error);
        return res.status(500).json({error:'Internal Server Error'});
    }
};

export const searchAlerts=async(req,res)=>{
    try{
        const{ typeId,where,sorting,paging }=req.body;
        
        //validations in validation file
        if(!typeId){
            return res.status(400).json({error: "Missing required field: typeId "})
        }
        if(!where || !Array.isArray(where.conditions)){
            return res.status(400).json({error: 'Invalid or Missing "where.conditions" in required field: typeId '})
        }
        if(!paging || typeof paging.pageSize !== 'number' || typeof paging.pageSize !== 'number'){
            return res.status(400).json({error: 'Invalid or Missing "paging" in required field: typeId '})
        }
        if(!sorting || !Array.isArray(sorting)){
            return res.status(400).json({error: 'Invalid or Missing "sorting" in required field: typeId '})
        }
        //will fetch the dynamic table name
        const tableName=`${typeId}s`;
        console.log("Dynamic table name:",tableName);
        //construction of where clause using where.conditions 
        const conditions=where.conditions.map(  
            (condition)=>
                `"${condition.field}" ${condition.operator} (${condition.values.map(() =>'?').join(', ')})`
        );
        const whereClause=conditions.join(` ${where.combine} `);
        //construction of ORDERBY clause
        const orderByClause=sorting
        .map((s)=>{
            const order=s.order?.toUpperCase(); //validate and convert order to uppercase
            if (order !== 'ASC' && order !== 'DESC'){
                throw new Error(`Invalid sorting order: ${s.order}`);   
            }
            return `"${s.field}" ${order}`;
        })
        .join(', ');
        //Construction of pagination
        const limit=paging.pageSize;
        const offset=paging.pageSize * paging.pageNumber;

        //SQL Queriess
        const query=`
        SELECT * FROM public."${tableName}"
        WHERE ${whereClause}
        ORDER BY ${orderByClause}
        LIMIT ${limit} OFFSET ${offset};
        `;
        //SQL QUERY FOR COUNT
        const countQuery=`
        SELECT COUNT(*) AS total FROM public."${tableName}"
        WHERE ${whereClause};
        `;

        //execution of queries
        const results=await sequelize.query(query,{
            replacements: where.conditions.flatMap((c)=>c.values),  //Tis 
            type: sequelize.QueryTypes.SELECT,
        });
        const countResult=await sequelize.query(countQuery,{
            replacements: where.conditions.flatMap((c)=>c.values),
            type: sequelize.QueryTypes.SELECT,
        });

     return res.status(200).json({count: countResult[0].total, data: results});
    }catch(error){
        console.error('Error searching alerts:',error);
        return res.status(500).json({error: 'Internal Server Error'});
    }
};