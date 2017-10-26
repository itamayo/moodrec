/**
 * @api {get} /exerciseAttr/:cmd/:id/:vector/:subjects/:question/:answers/:answer/:group/:bktParams/:token Exercises managment
 * @apiName ExercisesMod
 * @apiGroup Exercise
 * @apiSampleRequest http://donostian.eus:8888/exerciseAttr/
 * @apiParam {String} cmd Operation could be: create,get,remove,compare.Compare is for get similarity with subjects.
 * @apiParam {number} id  should be exercises id, create case should be 'none'.To get all exercises info just set id to 'none'
 * @apiParam {String} vector exercises vector 0.3,0.4,0.3
 * @apiParam {String} subjects skills vector bider,zati,gehi
 * @apiParam {String} question Only when creates, otherwise should be 'none'
 * @apiParam {String} answers Posibles answers; true,false
 * @apiParam {String} answer Correct answer; true
 * @apiParam {String} group To group a exercise on issue; Math
 * @apiParam {String} bktParams l0,lg,ls,lp parameters: 0.3,0.2,0.2,0.1
 * @apiParam {String} token secure token
 * @apiSuccess {String} id whether create called.
 * @apiSuccess {String} json with user info.
 */

