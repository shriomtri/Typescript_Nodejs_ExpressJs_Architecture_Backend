import express from 'express'
import signup from './access/signup';

const router = express.Router()

/*
* Below routes are for general user
* */
router.use('/signup', signup)

export default router