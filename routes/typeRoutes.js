import express from 'express';
import { createType,getAllTypes,getTypeById } from '../controllers/typeController.js';
const router=express.Router();
router.post('/types',createType);
router.get('/types',getAllTypes);
router.get('/types/:id',getTypeById);

export default router;
