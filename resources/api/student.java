/**
 * @api {get} /student/:cmd/:id/:admin/:token Student Managment
 * @apiName StudentMod
 * @apiGroup Student
 * @apiSampleRequest http://donostian.eus:8888/admin/login/admin/true/ripcpsrlro3mfdjsaieoppsaa
 * @apiParam {String} cmd Operation could be: get,remove,create.
 * @apiParam {String} id  id should be student id, if want get all users, use id 'none'.
 * @apiParam {String} admin to create admin user or not
 * @apiParam {string} admin secure token for creating users.
 * @apiSuccess {String} json with the result.
 */

