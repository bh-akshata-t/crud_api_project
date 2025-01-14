import {Type} from '../models/Type.js';
import { v4 as uuidv4} from 'uuid'; //Import uuid generator

export const createType=async(req,res)=>{
    try{
        //const {id,name,fields,desc}=req.body;
        const {name,fields,desc}=req.body;
        //generate uuid
        const id= uuidv4();

        //insertion into types table with generated uuid
        const type = await Type.create({id,name,fields,desc});
        return res.status(201).json({id: type.id});
    }catch(error){
        console.error('error creating type:',error);
        return res.status(500).json({error:'internal server error'});
    }
};

export const getAllTypes=async(req,res)=>{
    try{
        const types= await Type.findAll();
        return res.status(201).json(types);
    }catch(error){
        console.error('error fetching type:',error);
        return res.status(500).json({error:'internal server error'});
    }
};
export const getTypeById=async(req,res)=>{
    try{
        const {id}=req.params;
        const type=await Type.findByPk(id);
        if(!type){
            return res.status(404).json({});
        }
        
        return res.status(200).json(type);
    }catch(error){
        console.error('error fetching type by Id:',error);
        return res.status(500).json({error:'internal server error'});
    }
};
