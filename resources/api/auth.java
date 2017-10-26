/**
 * @api {get} /admin/:cmd/:id/:admin/:token Authentification service
 * @apiName AuthMod
 * @apiGroup Auth
 * @apiSampleRequest http://donostian.eus:8888/admin/
 * @apiParam {String} cmd Operation could be: create,login,remove.
 * @apiParam {number} id  if login or remove called, id should be user id.
 * @apiParam {Boolean} admin  whether user is admin or not
 * @apiParam {string} token create,remove should be use admin token
 * @apiSuccess {String} token whether create called.
 * @apiSuccess {String} json with result reponse ok,error.
 */

