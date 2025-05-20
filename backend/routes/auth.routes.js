import express from 'express'
import * as authController from '../controllers/auth.controller.js'
import * as authMiddleware from '../middlewares/auth.middleware.js'

const router = express.Router()


router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/logout', authController.logout)

router.get("/check-auth", authMiddleware.checkToken);
router.get("/admin/check-auth", authMiddleware.checkAdminToken);

router.post('/admin/login', authController.adminLogin)
router.post('/admin/logout', authController.adminLogout)


export default router