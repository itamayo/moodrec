define({ "api": [
  {
    "type": "get",
    "url": "/admin/:cmd/:id/:admin/:token",
    "title": "Authentification service",
    "name": "AuthMod",
    "group": "Auth",
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
    "url": "/subject/:cmd/:id/:skills/:vector/:doc/:token",
    "title": "Subject Managment",
    "name": "SubjectMod",
    "group": "Subject",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "cmd",
            "description": "<p>Operation could be: create,get,remove,getRecommendation.</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
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
    "type": "get",
    "url": "/student/:cmd/:id/:admin/:token",
    "title": "User managment",
    "name": "UserMod",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "cmd",
            "description": "<p>Operation could be: create,get,remove.</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "id",
            "description": "<p>should be user id, create case should be 'none'.To get all users info just set id to 'none'</p>"
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
    "filename": "./student.java",
    "groupTitle": "User"
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
  }
] });
