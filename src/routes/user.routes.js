import express from "express"
import * as userController from "../controllers/user.controller.js"
import auth from "../middlewares/auth.middleware.js"

const router = express.Router()

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     description: Connecte un utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Succès
 */
router.post("/login", userController.signInUser)


/**
 * @swagger
 * /api/users/register:
 *   post:
 *     description: Enregistre un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 description: Date de création de l'utilisateur. Si non fournie, la date actuelle sera utilisée.
 *               updatedAt:
 *                 type: string
 *                 format: date-time
 *                 description: Date de dernière mise à jour de l'utilisateur. Si non fournie, la date actuelle sera utilisée.
 *     responses:
 *       200:
 *         description: Succès
 */
router.post("/register", userController.createUser)

/**
 * @swagger
 * /api/users/:
 *   get:
 *     description: Récupère tous les utilisateurs
 *     responses:
 *       200:
 *         description: Succès
 */
router.route("/").get( userController.getAllUsers)

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     description: Récupère l'utilisateur courant
 *     responses:
 *       200:
 *         description: Succès
 */
router.get("/me", auth, userController.getCurrentUser)
/**
 * @swagger
 * /api/users/confirm/{token}:
 *   get:
 *     description: Confirme l'email de l'utilisateur
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Token de confirmation
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Succès
 */
router.get("/confirm/:token", userController.confirmEmail)

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     description: Récupère un utilisateur spécifique
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Succès
 *   put:
 *     description: Met à jour un utilisateur spécifique
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Succès
 *   delete:
 *     description: Supprime un utilisateur spécifique
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Succès
 */
router
  .route("/:id")
  .get(auth, userController.getUser)
  .put(auth, userController.updateUser)
  .delete(auth, userController.deleteUser)

  router.get("/find/:userId", userController.findUser)
export default router