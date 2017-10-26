/**
 * @api {get} /subject/:cmd/:id/:skills/:vector/:doc/:token Subject Managment
 * @apiName SubjectMod
 * @apiGroup Subject
 * @apiSampleRequest http://donostian.eus:8888/subject/
 * @apiParam {String} cmd Operation could be: get,remove,getRecommendation.GetRecommendation is testing operation, for test skills with vectors
 * @apiParam {String} id  if login or remove called, id should be subject id, if want get all use id 'none'.
 * @apiParam {String} skills subject skills divided by ',', example: gehi,ken,bider 
 * @apiParam {string} vector vector related with skills,example: 0.5,0.3,0.2
 * @apiParam {string} doc vector related with skills,example: 0.5,0.3,0.2
 * @apiParam {string} secure token
 * @apiSuccess {String} json with the result.
 */

/**
 * @api {post} /subject/:cmd/:id/:skills/:vector/:doc/:token Add subject + upload file
 * @apiName SubjectFileMod
 * @apiGroup SubjectFile
 *
 * @apiParam {String} cmd Operation could be: create.
 * @apiParam {String} id 'none'.
 * @apiParam {String} skills subject skills divided by ',', example: gehi,ken,bider 
 * @apiParam {string} vector vector related with skills,example: 0.5,0.3,0.2
 * @apiParam {string} doc vector related with skills,example: 0.5,0.3,0.2
 * @apiParam {string} secure token
 * @apiSuccess {String} json with the result.
 */

