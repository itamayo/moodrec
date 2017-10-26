/**
 * @api {get} /studentSkill/:cmd/:skill/:id/:correct/:exId/:bktParams/:token Student skill and recommendation managment
 * @apiName StudentSkillMod
 * @apiGroup StudentSkill
 * @apiSampleRequest http://donostian.eus:8888/
 * @apiParam {String} cmd Operation could be: add,get,update,remove,getUserRecommendation. Update is for update user pknown and getUserRecommendations is used in order to get recommentadions based on user skills pknown. For updating user skill, is checked exercise answer whether is correct or not it is updated, based on given btkParams. Updated operation is called whenever user has made a exercise. 
 * @apiParam {number} id  should be user id, add case should be 'none'.To get all exercises info just set id to 'none'
 * @apiParam {String} skill is only userd with add and update
 * @apiParam {String} correct user response of exercise
 * @apiParam {String} exId Exercise Id.
 * @apiParam {String} bktParams l0,lg,ls,lp parameters: 0.3,0.2,0.2,0.1
 * @apiParam {String} token secure token
 * @apiSuccess {String} id whether create called.
 * @apiSuccess {String} json with user's skill info or recommendation list.
 */

