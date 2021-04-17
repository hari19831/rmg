/*jshint esversion: 8 */

const ROUTER = require("express").Router();
const CONTROLLER = require("../controller/controller");
const MIDDLEWARE = require("../middleware/auth.middleware");
const VALIDATOR = require("../validator/project");

const handler = (cb) => function (request, response, next) {
  Promise.resolve(cb(request, response, next)).catch(error => next(error));
};
/* -------------Router Configurations---------------------- */
/**
  * @swagger
  * /welcome:
  *   get:
  *     description: Returns the homepage
  *     responses:
  *       200:
  *         description: Get successfull !!
  */
ROUTER.get("/welcome", handler(CONTROLLER.WelcomeAPI));
/**
 * @swagger
 * /createProduct:
 *   post:
 *     summary: Creating or updating the Product
 *     description: If new project details provided it will create the project and return the apikey, which is used for getting the project information and performing cache functionalities. And if the same product is exists then new version of product information will be saved. All the versions will be saved for future references.
 *     security: 
 *          - Auth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *                         type: object
 *                         properties:  
 *                              product_name:
 *                                  type: string 
 *                                  description: Name of the product.
 *                                  example: iAuthor
 *                              default_life_time:
 *                                  type: string 
 *                                  description: Life time of the product in seconds.
 *                                  example: 1440
 *                              allocated_mb:
 *                                  type: string 
 *                                  description: Allocated memory in redis for the product in mb.
 *                                  example: 500
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema: 
 *               type: object
 *               properties:    
 *                       is_success:
 *                         type: boolean
 *                         example: true
 *                       data:
 *                           type: object
 *                           properties:
 *                       message:
 *                          type: string
 *                          example: Project updated successfully.
 *       401:
 *          description: Unauthorized
 *          content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/unAuthorized'
 *       422:
 *          description: Unprocessable Entity
 *          content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 is_success: 
 *                  type: boolean 
 *                  example: false
 *                 data:
 *                   type: string 
 *                   example: product_name should be provided.
 *                 message:
 *                    type: string 
 *                    example: product_name should be provided.
*/
ROUTER.post('/createProduct', handler(MIDDLEWARE.apiPrivateKey), handler(VALIDATOR.projectValidator), handler(CONTROLLER.CreateProduct));
/**
 * @swagger
 * /getProductByName:
 *   get:      
 *     summary: Retrieve the product.
 *     description: Retrieve the product along with its key and value.
 *     security: 
 *          - Auth: []
 *     responses:
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:    
 *                       is_success:
 *                         type: boolean
 *                         description: whether successful?.
 *                         example: true
 *                       data:
 *                         type: object
 *                         properties:  
 *                              product_name:
 *                                  type: string 
 *                                  description: Name of the product.
 *                                  example: iAuthor
 *                              version:
 *                                  type: integer 
 *                                  description: Version.
 *                                  example: 1
 *                              product_key:
 *                                  type: string 
 *                                  description: Product key generated while creating the product.
 *                                  example: ef0f5db7
 *                              apikey:
 *                                  type: string 
 *                                  description: Auto generated key generated while creating the product.
 *                                  example: 9fbffe87225b6ef208b0907bae93f10e6707de9a0caa874d7d3a85b278016454069396571bf6a9031b65f642e0434f7c46694c64dc61349ed1d23b48a4f1563f991f7e82236c44c79da53fb3a10e4340d85e6c43194390b63a9ac60c0c25d96556adeec6f68f5702cefaf052731d45562ad2213c8d322e3057f8ccf836bcc011b7f1a978775076e2c705a82d6a82569cc1eaa2
 *                              is_active:
 *                                  type: boolean 
 *                                  description: whether the product id active.
 *                                  example: true
 *                              default_life_time:
 *                                  type: string 
 *                                  description: Life time of the product in seconds.
 *                                  example: 1440
 *                              allocated_mb:
 *                                  type: string 
 *                                  description: Allocated memory in redis for the product in mb.
 *                                  example: 500
 *       401:
 *          description: Unauthorized
 *          content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/unAuthorized'
 *       422:
 *          description: Unprocessable Entity
 *          content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 is_success: 
 *                  type: boolean 
 *                  example: false
 *                 data:
 *                   type: string 
 *                   example: product_name should be provided.
 *                 message:
 *                    type: string 
 *                    example: product_name should be provided.
 */
ROUTER.get('/getProductByName', handler(MIDDLEWARE.ProductKeyAuth), handler(CONTROLLER.getProduct));
/**
 * @swagger
 * /getAllProduct:
 *   get:      
 *     summary: Retrieve the all product.
 *     description: Retrieve the product along with its key and value.
 *     security: 
 *          - Auth: []
 *     responses:
 *       401:
 *          description: Unauthorized
 *       422:
 *          description: Unprocessable Entity
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:    
 *                       is_success:
 *                         type: boolean
 *                         description: whether successful?.
 *                         example: true
 *                       data:
 *                         type: object
 *                         properties:  
 *                              product_name:
 *                                  type: string 
 *                                  description: Name of the product.
 *                                  example: iAuthor
 *                              version:
 *                                  type: integer 
 *                                  description: Version.
 *                                  example: 1
 *                              product_key:
 *                                  type: string 
 *                                  description: Product key generated while creating the product.
 *                                  example: ef0f5db7
 *                              apikey:
 *                                  type: string 
 *                                  description: Auto generated key generated while creating the product.
 *                                  example: 9fbffe87225b6ef208b0907bae93f10e6707de9a0caa874d7d3a85b278016454069396571bf6a9031b65f642e0434f7c46694c64dc61349ed1d23b48a4f1563f991f7e82236c44c79da53fb3a10e4340d85e6c43194390b63a9ac60c0c25d96556adeec6f68f5702cefaf052731d45562ad2213c8d322e3057f8ccf836bcc011b7f1a978775076e2c705a82d6a82569cc1eaa2
 *                              is_active:
 *                                  type: boolean 
 *                                  description: whether the product id active.
 *                                  example: true
 *                              default_life_time:
 *                                  type: string 
 *                                  description: Life time of the product in seconds.
 *                                  example: 1440
 *                              allocated_mb:
 *                                  type: string 
 *                                  description: Allocated memory in redis for the product in mb.
 *                                  example: 500
 */
ROUTER.get('/getAllProduct', handler(MIDDLEWARE.apiPrivateKey), handler(CONTROLLER.getAllProduct));
/**
 * @swagger
 * /deactiveProduct:
 *   post:
 *     summary: Deactivate the Product
 *     description: Deactivate the active product based on selection.
 *     security: 
 *          - Auth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *          description: Unauthorized
 *       422:
 *          description: Unprocessable Entity
*/
ROUTER.post('/deactiveProduct',handler(MIDDLEWARE.ProductAuth), handler(CONTROLLER.deactivateProduct));
/**
 * @swagger
 * /activeProduct:
 *   post:
 *     summary: Activate the Product
 *     description: Activate the deactivated product based on selection.
 *     security: 
 *          - Auth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *          description: Unauthorized
 *       422:
 *          description: Unprocessable Entity
*/
ROUTER.post('/activeProduct',handler(MIDDLEWARE.ProductAuth), handler(CONTROLLER.activateProduct));
/**
 * @swagger
 * /deleteProduct:
 *   post:
 *     summary: Delete the Product
 *     description: Delete the selected product from the db.
 *     security: 
 *          - Auth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *                         type: object
 *                         properties:  
 *                              product_name:
 *                                  type: string 
 *                                  description: Name of the product.
 *                                  example: iAuthor
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *          description: Unauthorized
 *       422:
 *          description: Unprocessable Entity
*/
ROUTER.post('/deleteProduct',handler(MIDDLEWARE.ProductAuth), handler(VALIDATOR.projectValidator), handler(CONTROLLER.deleteProduct));
/**
 * @swagger
 * /createQueue:
 *   post:
 *     summary: Creating or updating the Queue
 *     description: If new project details provided it will create the project and return the apikey, which is used for getting the project information and performing cache functionalities. And if the same product is exists then new version of product information will be saved. All the versions will be saved for future references.
 *     security: 
 *          - Auth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *                         type: object
 *                         properties:  
 *                              queueName:
 *                                  type: string 
 *                                  description: Name of the queue.
 *                                  example: Test
 *                              exchangeType:
 *                                  type: string 
 *                                  description: exchangeType of queue.
 *                                  example: direct
 *                              exchangeKey:
 *                                  type: string 
 *                                  description: exchangeKey.
 *                                  example: Hello
 *                              exchangeName:
 *                                  type: string 
 *                                  description: exchangeName.
 *                                  example: direct_logs_hello
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema: 
 *               type: object
 *               properties:    
 *                       is_success:
 *                         type: boolean
 *                         example: true
 *                       data:
 *                           type: object
 *                           properties:
 *                       message:
 *                          type: string
 *                          example: Queue created successfully.
 *       401:
 *          description: Unauthorized
 *          content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/unAuthorized'
 *       422:
 *          description: Unprocessable Entity
 *          content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 is_success: 
 *                  type: boolean 
 *                  example: false
 *                 data:
 *                   type: string 
 *                   example: queueName should be provided.
 *                 message:
 *                    type: string 
 *                    example: queueName should be provided.
*/
ROUTER.post('/createQueue',handler(MIDDLEWARE.ProductKeyAuth),handler(CONTROLLER.InsertQueueProduct));
/**
 * @swagger
 * /getAllQueue:
 *   get:      
 *     summary: Retrieves the all queue.
 *     description: Retrieve the queues present in the product.
 *     security: 
 *          - Auth: []
 *     responses:
 *       401:
 *          description: Unauthorized
 *       422:
 *          description: Unprocessable Entity
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:    
 *                       is_success:
 *                         type: boolean
 *                         description: whether successful?.
 *                         example: true
 *                       data:
 *                         type: object
 *                         properties:  
 *                              queueName:
 *                                  type: string 
 *                                  description: Name of the queue.
 *                                  example: Test
 *                              exchangeType:
 *                                  type: string 
 *                                  description: exchangeType.
 *                                  example: 1
 *                              product_key:
 *                                  type: string 
 *                                  description: Product key generated while creating the product.
 *                                  example: ef0f5db7
 *                              apikey:
 *                                  type: string 
 *                                  description: Auto generated key generated while creating the product.
 *                                  example: 9fbffe87225b6ef208b0907bae93f10e6707de9a0caa874d7d3a85b278016454069396571bf6a9031b65f642e0434f7c46694c64dc61349ed1d23b48a4f1563f991f7e82236c44c79da53fb3a10e4340d85e6c43194390b63a9ac60c0c25d96556adeec6f68f5702cefaf052731d45562ad2213c8d322e3057f8ccf836bcc011b7f1a978775076e2c705a82d6a82569cc1eaa2
 *                              is_active:
 *                                  type: boolean 
 *                                  description: whether the product id active.
 *                                  example: true
 *                              default_life_time:
 *                                  type: string 
 *                                  description: Life time of the product in seconds.
 *                                  example: 1440
 *                              allocated_mb:
 *                                  type: string 
 *                                  description: Allocated memory in redis for the product in mb.
 *                                  example: 500
 */
ROUTER.get('/getAllQueue', handler(MIDDLEWARE.ProductKeyAuth), handler(CONTROLLER.getAllQueue));
/**
 * @swagger
 * /deleteQueue:
 *   post:
 *     summary: Deleting the Queue
 *     description: If new project details provided it will create the project and return the apikey, which is used for getting the project information and performing cache functionalities. And if the same product is exists then new version of product information will be saved. All the versions will be saved for future references.
 *     security: 
 *          - Auth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *                         type: object
 *                         properties:  
 *                              queueName:
 *                                  type: string 
 *                                  description: Name of the queue.
 *                                  example: Test
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema: 
 *               type: object
 *               properties:    
 *                       is_success:
 *                         type: boolean
 *                         example: true
 *                       data:
 *                           type: object
 *                           properties:
 *                       message:
 *                          type: string
 *                          example: Queue deleted successfully.
 *       401:
 *          description: Unauthorized
 *          content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/unAuthorized'
 *       422:
 *          description: Unprocessable Entity
 *          content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 is_success: 
 *                  type: boolean 
 *                  example: false
 *                 data:
 *                   type: string 
 *                   example: queueName should be provided.
 *                 message:
 *                    type: string 
 *                    example: queueName should be provided.
*/
ROUTER.post('/deleteQueue',handler(MIDDLEWARE.ProductKeyAuth),handler(CONTROLLER.deleteQueue));
/**
 * @swagger
 * /publishMessage:
 *   post:
 *     summary: Publish message to the queue
 *     description: If new project details provided it will create the project and return the apikey, which is used for getting the project information and performing cache functionalities. And if the same product is exists then new version of product information will be saved. All the versions will be saved for future references.
 *     security: 
 *          - Auth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *                         type: object
 *                         properties:  
 *                              queueName:
 *                                  type: string 
 *                                  description: Name of the queue.
 *                                  example: Test
 *                              msg:
 *                                  type: string 
 *                                  description: message to be published.
 *                                  example:  message to be published
 *                              exchangeKey:
 *                                  type: string 
 *                                  description: exchangeKey.
 *                                  example: Hello
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema: 
 *               type: object
 *               properties:    
 *                       is_success:
 *                         type: boolean
 *                         example: true
 *                       data:
 *                           type: object
 *                           properties:
 *                       message:
 *                          type: string
 *                          example: sent Information.
 *       401:
 *          description: Unauthorized
 *          content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/unAuthorized'
 *       422:
 *          description: Unprocessable Entity
 *          content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 is_success: 
 *                  type: boolean 
 *                  example: false
 *                 data:
 *                   type: string 
 *                   example: message should be provided.
 *                 message:
 *                    type: string 
 *                    example: message should be provided.
*/
ROUTER.post('/publishMessage',handler(MIDDLEWARE.ProductKeyAuth),handler(CONTROLLER.publishMessage));
/**
 * @swagger
 * /receiveMessage:
 *   post:
 *     summary: Receiving the message from the Queue
 *     description: If new project details provided it will create the project and return the apikey, which is used for getting the project information and performing cache functionalities. And if the same product is exists then new version of product information will be saved. All the versions will be saved for future references.
 *     security: 
 *          - Auth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *                         type: object
 *                         properties:  
 *                              queueName:
 *                                  type: string 
 *                                  description: Name of the queue.
 *                                  example: Test
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema: 
 *               type: object
 *               properties:    
 *                       is_success:
 *                         type: boolean
 *                         example: true
 *                       data:
 *                           type: object
 *                           properties:
 *                       message:
 *                          type: string
 *                          example: Receive Message.
 *       401:
 *          description: Unauthorized
 *          content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/unAuthorized'
 *       422:
 *          description: Unprocessable Entity
 *          content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 is_success: 
 *                  type: boolean 
 *                  example: false
 *                 data:
 *                   type: string 
 *                   example: queueName should be provided.
 *                 message:
 *                    type: string 
 *                    example: queueName should be provided.
*/
ROUTER.get('/receiveMessage',handler(MIDDLEWARE.ProductKeyAuth),handler(CONTROLLER.receiveMessage));
/**
 * @swagger
 * /clearQueueMessage:
 *   post:
 *     summary: Clear the messages in the Queue
 *     description: If new project details provided it will create the project and return the apikey, which is used for getting the project information and performing cache functionalities. And if the same product is exists then new version of product information will be saved. All the versions will be saved for future references.
 *     security: 
 *          - Auth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *                         type: object
 *                         properties:  
 *                              queueName:
 *                                  type: string 
 *                                  description: Name of the queue.
 *                                  example: Test
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema: 
 *               type: object
 *               properties:    
 *                       is_success:
 *                         type: boolean
 *                         example: true
 *                       data:
 *                           type: object
 *                           properties:
 *                       message:
 *                          type: string
 *                          example: Queue messages cleared successfully.
 *       401:
 *          description: Unauthorized
 *          content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/unAuthorized'
 *       422:
 *          description: Unprocessable Entity
 *          content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 is_success: 
 *                  type: boolean 
 *                  example: false
 *                 data:
 *                   type: string 
 *                   example: queueName should be provided.
 *                 message:
 *                    type: string 
 *                    example: queueName should be provided.
*/
ROUTER.post('/clearQueueMessage',handler(MIDDLEWARE.ProductKeyAuth),handler(CONTROLLER.clearQueueMessage));
ROUTER.post('/login', handler(MIDDLEWARE.apiPrivateKey), handler(CONTROLLER.login));

module.exports = ROUTER;