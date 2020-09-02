import 'materialize-css';
import 'materialize-css';
import ProjectController from './ProjectController';

const DOMController = (() => {
    const renderProjects = () => {
        var elem = document.querySelector('.collapsible');
        let instance = M.Collapsible.init(elem);

        const projects = ProjectController.getProjects();
        console.log(projects);
    }

    return { renderProjects }
})();

export default DOMController;