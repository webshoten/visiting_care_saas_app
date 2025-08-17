export default {
    "scalars": [
        1,
        5
    ],
    "types": {
        "CareRecipient": {
            "address": [
                1
            ],
            "allergies": [
                1
            ],
            "birthDate": [
                1
            ],
            "bloodType": [
                1
            ],
            "createdAt": [
                1
            ],
            "email": [
                1
            ],
            "emergencyContactName": [
                1
            ],
            "emergencyContactPhone": [
                1
            ],
            "emergencyContactRelation": [
                1
            ],
            "firstName": [
                1
            ],
            "firstNameKana": [
                1
            ],
            "gender": [
                1
            ],
            "id": [
                1
            ],
            "lastName": [
                1
            ],
            "lastNameKana": [
                1
            ],
            "medicalHistory": [
                1
            ],
            "medications": [
                1
            ],
            "phone": [
                1
            ],
            "updatedAt": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "String": {},
        "Mutation": {
            "addCareRecipient": [
                0,
                {
                    "address": [
                        1
                    ],
                    "allergies": [
                        1
                    ],
                    "birthDate": [
                        1,
                        "String!"
                    ],
                    "bloodType": [
                        1,
                        "String!"
                    ],
                    "email": [
                        1
                    ],
                    "emergencyContactName": [
                        1
                    ],
                    "emergencyContactPhone": [
                        1
                    ],
                    "emergencyContactRelation": [
                        1
                    ],
                    "firstName": [
                        1,
                        "String!"
                    ],
                    "firstNameKana": [
                        1,
                        "String!"
                    ],
                    "gender": [
                        1,
                        "String!"
                    ],
                    "lastName": [
                        1,
                        "String!"
                    ],
                    "lastNameKana": [
                        1,
                        "String!"
                    ],
                    "medicalHistory": [
                        1
                    ],
                    "medications": [
                        1
                    ],
                    "notes": [
                        1
                    ],
                    "phone": [
                        1,
                        "String!"
                    ]
                }
            ],
            "__typename": [
                1
            ]
        },
        "Query": {
            "careRecipients": [
                0
            ],
            "hello": [
                1
            ],
            "user": [
                4,
                {
                    "userId": [
                        1,
                        "String!"
                    ]
                }
            ],
            "__typename": [
                1
            ]
        },
        "User": {
            "noteId": [
                1
            ],
            "userId": [
                1
            ],
            "version": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "Boolean": {}
    }
}