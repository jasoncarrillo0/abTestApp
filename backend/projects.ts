import { Request, Response, Router } from "express";
import { AbTest, AdminUser, PopulatedLeanProjectDoc, PopulatedProjectStripped, Project, ProjectInterface, testDB } from "../../mongoose/schemas";
import to from "await-to-js"
import { deleteDesignsInAbTest, getAllProjects, logAction } from '../../app-utils/helpers'

interface SuccessResponse {
    success: boolean,
    projects: PopulatedProjectStripped[]
}


interface ErrResponse {
    error: string
}


const projectsRouter = Router();
/*
    GET, POST, DELETE, PATCH a project 
*/
projectsRouter.route('/')
.post(async (req: Request, res: Response) => {
    let error: ErrResponse       = { error: "" };
    let success: SuccessResponse = {success: false, projects: []};
    const session                = await testDB.startSession();
    session.startTransaction();
    try {
        const project: ProjectInterface = req.body.project;
        const [e1, doc]                 = await to(Project.findOne({name: project.name}).exec());

        if (e1) throw new Error(e1.message);
        // doc will be null if not in DB
        if (doc) throw new Error("That name is already taken.");


        project.createdAt         = new Date().toISOString();
        const p                   = new Project(project);
        const [saveErr, savedDoc] = await to(p.save({session: session}));
        if (saveErr) throw new Error(saveErr.message);
        if (!savedDoc) throw new Error("Save func didn't return the document.");
        logAction(`Saved new project: ${savedDoc._id}`);
        
        const [e2, allProjects] = await to(getAllProjects(session));
        if (e2) throw new Error(e2.message);
        if (!allProjects) throw new Error("No projects returned from .find");

        // commit transaction and get all projects
        await session.commitTransaction();
        await session.endSession();
        success.success  = true;
        success.projects = allProjects;
        return res.send(success);
    } catch (e) {
        console.log(e);
        await session.abortTransaction();
        await session.endSession();
        logAction(`Aborted transaction, ended session`)
        error = { error: e.message};
        return res.send(error);
    }
});
export { projectsRouter }