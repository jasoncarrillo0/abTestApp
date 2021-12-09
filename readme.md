# Ab Test App



My previous employer allowed me to take a few files from the Ab Test app, that allowed a design and marketing team to collaborate on A/B Tests. They could create projects, A/B Tests within projects, and designs within A/B tests. The app was built with the MERN stack (MongoDB, Express, React, and NodeJS), all in Typescript.

The app also uses Redis for handling JWT authentication, in order to restrict access to specific types of users with different CRUD privileges.

### File Descriptions


#### _Backend_
**helpers.ts** - this file contains a few of the helper functions I used to handle image uploads for the A/B test designs.<br/>
**projects.ts** - an api route for creating a project.<br/>
**schemas.ts** - shows the Design schema for mongoose/MongoDB.


#### _Frontend_
**DesignCard.tsx** - a react card component using MUI.<br/>
**PrivateRoute.tsx** - a react-router HOC, serving as a gateway between authenticated and un-authenticated users.<br/>
**createAbTestReducer.ts** - Redux reducer for the entire A/B test creation process.<br/>
