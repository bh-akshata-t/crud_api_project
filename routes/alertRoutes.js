import express from 'express';
import {createAlerts,searchAlerts} from '../controllers/alertController.js';

const router=express.Router();
router.post('/alerts',createAlerts);
router.post('/alerts/search',searchAlerts);

export default router;