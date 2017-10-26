define({ "api": [
  {
    "type": "get",
    "url": "/admin/:cmd/:id/:admin/:token",
    "title": "Authentification service",
    "name": "AuthMod",
    "group": "Auth",
    "sampleRequest": [
      {
        "url": "http://donostian.eus:8888/"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "cmd",
            "description": "<p>Operation could be: create,login,remove.</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "id",
            "description": "<p>if login or remove called, id should be user id.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "admin",
            "description": "<p>whether user is admin or not</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>create,remove should be use admin token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>whether create called.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "json",
            "description": "<p>with result reponse ok,error.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./auth.java",
    "groupTitle": "Auth"
  },
  {
    "type": "get",
    "url": "/browse/:file_folder",
    "title": "Browse static files like webpages",
    "name": "BrowserMod",
    "group": "Browser",
    "sampleRequest": [
      {
        "url": "http://localhost:8888/browse/tests/index.html"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "file_folder",
            "description": "<p>path mapped to local folder ./resources</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "web",
            "description": "<p>resource.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./browser.java",
    "groupTitle": "Browser"
  },
  {
    "type": "get",
    "url": "/exerciseAttr/:cmd/:id/:vector/:subjects/:question/:answers/:answer/:group/:bktParams/:token",
    "title": "Exercises managment",
    "name": "ExercisesMod",
    "group": "Exercise",
    "sampleRequest": [
      {
        "url": "http://donostian.eus:8888/"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "cmd",
            "description": "<p>Operation could be: create,get,remove,compare.Compare is for get similarity with subjects.</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "id",
            "description": "<p>should be exercises id, create case should be 'none'.To get all exercises info just set id to 'none'</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "vector",
            "description": "<p>exercises vector 0.3,0.4,0.3</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "subjects",
            "description": "<p>skills vector bider,zati,gehi</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "question",
            "description": "<p>Only when creates, otherwise should be 'none'</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "answers",
            "description": "<p>Posibles answers; true,false</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "answer",
            "description": "<p>Correct answer; true</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "group",
            "description": "<p>To group a exercise on issue; Math</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "bktParams",
            "description": "<p>l0,lg,ls,lp parameters: 0.3,0.2,0.2,0.1</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>secure token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>whether create called.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "json",
            "description": "<p>with user info.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./exercises.java",
    "groupTitle": "Exercise"
  },
  {
    "type": "get",
    "url": "/studentSkill/:cmd/:skill/:id/:correct/:exId/:bktParams/:token",
    "title": "Student skill and recommendation managment",
    "name": "StudentSkillMod",
    "group": "StudentSkill",
    "sampleRequest": [
      {
        "url": "http://donostian.eus:8888/"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "cmd",
            "description": "<p>Operation could be: add,get,update,remove,getUserRecommendation. Update is for update user pknown and getUserRecommendations is used in order to get recommentadions based on user skills pknown. For updating user skill, is checked exercise answer whether is correct or not it is updated, based on given btkParams. Updated operation is called whenever user has made a exercise.</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "id",
            "description": "<p>should be user id, add case should be 'none'.To get all exercises info just set id to 'none'</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "skill",
            "description": "<p>is only userd with add and update</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "correct",
            "description": "<p>user response of exercise</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "exId",
            "description": "<p>Exercise Id.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "bktParams",
            "description": "<p>l0,lg,ls,lp parameters: 0.3,0.2,0.2,0.1</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>secure token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>whether create called.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "json",
            "description": "<p>with user's skill info or recommendation list.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./studentSkill.java",
    "groupTitle": "StudentSkill"
  },
  {
    "type": "get",
    "url": "/student/:cmd/:id/:admin/:token",
    "title": "Student Managment",
    "name": "StudentMod",
    "group": "Student",
    "sampleRequest": [
      {
        "url": "http://donostian.eus:8888/"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "cmd",
            "description": "<p>Operation could be: get,remove,create.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>id should be student id, if want get all users, use id 'none'.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "admin",
            "description": "<p>to create admin user or not</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "json",
            "description": "<p>with the result.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./student.java",
    "groupTitle": "Student"
  },
  {
    "type": "post",
    "url": "/subject/:cmd/:id/:skills/:vector/:doc/:token",
    "title": "Add subject + upload file",
    "name": "SubjectFileMod",
    "group": "SubjectFile",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "cmd",
            "description": "<p>Operation could be: create.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>'none'.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "skills",
            "description": "<p>subject skills divided by ',', example: gehi,ken,bider</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "vector",
            "description": "<p>vector related with skills,example: 0.5,0.3,0.2</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "doc",
            "description": "<p>vector related with skills,example: 0.5,0.3,0.2</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "secure",
            "description": "<p>token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "json",
            "description": "<p>with the result.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./subject.java",
    "groupTitle": "SubjectFile"
  },
  {
    "type": "get",
    "url": "/subject/:cmd/:id/:skills/:vector/:doc/:token",
    "title": "Subject Managment",
    "name": "SubjectMod",
    "group": "Subject",
    "sampleRequest": [
      {
        "url": "http://donostian.eus:8888/"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "cmd",
            "description": "<p>Operation could be: get,remove,getRecommendation.GetRecommendation is testing operation, for test skills with vectors</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>if login or remove called, id should be subject id, if want get all use id 'none'.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "skills",
            "description": "<p>subject skills divided by ',', example: gehi,ken,bider</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "vector",
            "description": "<p>vector related with skills,example: 0.5,0.3,0.2</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "doc",
            "description": "<p>vector related with skills,example: 0.5,0.3,0.2</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "secure",
            "description": "<p>token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "json",
            "description": "<p>with the result.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./subject.java",
    "groupTitle": "Subject"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./apidoc/main.js",
    "group": "_home_ubuntu_MoodRec_resources_api_apidoc_main_js",
    "groupTitle": "_home_ubuntu_MoodRec_resources_api_apidoc_main_js",
    "name": ""
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./doc/main.js",
    "group": "_home_ubuntu_MoodRec_resources_api_doc_main_js",
    "groupTitle": "_home_ubuntu_MoodRec_resources_api_doc_main_js",
    "name": ""
  }
] });
