import express from 'express'
import signup from './account/signup';
import login from './account/login'

const router = express.Router()

/*
* Below routes are for general user
* */
router.use('/signup', signup)

/*
* Below route are for internal users i.e WRITER, SUPERVISOR and ADMIN
* */

router.use('/login', login)

export default router