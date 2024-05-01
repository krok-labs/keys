25.04.2024

GET /keycard/:id
    1) Get one user from InteksACS's firebird database
    2) Find users with same name, surname and last name in Azure Entra ID
    3) Find them (or create) in our local database and return all related information in these format:

        [
            {
                aid,
                avatarUrl,
                displayName: surname + name + last name,
                jobTitle,
                officeLocation,
                userPrincipalName
            }
        ]

todo:
1) Add /users/aid={aid} route
2) Add /users/id={id} route
3) Add /users/{gid}/photo route 


26.04.2024

1) Reading keycard
2) Retrieving users from /keycard/:keycardId
3) Retrieving users' allowedKeys
4) 
