import express from 'express'
import user from './account/user'

const router = express.Router()

/*
* Below routes are for general user
* */


/*
* Below route are for internal users i.e WRITER, SUPERVISOR and ADMIN
* */

router.use('/account', user)

export default router