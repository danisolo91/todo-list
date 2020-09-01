import ProjectController from './ProjectController';

const DOMController = (() => {
    const renderProjects = () => {
        const projects = ProjectController.getProjects();
        console.log(projects);
    }

    return { renderProjects }
})();

export default DOMController;