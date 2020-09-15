import express from 'express'
import signup from './access/signup';

const router = express.Router()

router.use('/signup', signup)

export default router