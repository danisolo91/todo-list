import 'materialize-css';
import ProjectController from './ProjectController';

const DOMController = (() => {
    const elem = document.querySelector('.collapsible');
    const collapsibleInstance = M.Collapsible.init(elem);
    const elems = document.querySelectorAll('.modal');
    let modalInstance = M.Modal.init(elems)[0];
    const projectForm = document.querySelector('#project-form');
    projectForm.onsubmit = saveProject.bind();

    const renderProjects = () => {
        const projects = ProjectController.getProjects();
        if(projects.length > 0) {
            clearProjectsMessages();
            projects.forEach((project, i) => {
                const projectLi = createProject(project, i);
                elem.appendChild(projectLi);
                loadProjectEvents(projectLi);
            });
        } else {
            showNoProjectsMsg();
        }
        collapsibleInstance.open(0);
    }

    const createProject = (project, id) => {
        const projectLi = document.createElement('li');
        const projectHeader = document.createElement('div');
        const projectIcon = document.createElement('i');
        const projectBody = document.createElement('div');
        const projectOptions = document.createElement('div');
        const projectAddTodoBtn = document.createElement('a');
        const projectAddTodoIco = document.createElement('i');
        const projectEditBtn = document.createElement('a');
        const projectEditIco = document.createElement('i');
        const projectDeleteBtn = document.createElement('a');
        const projectDeleteIco = document.createElement('i');

        projectLi.id = `pr-${id}`;
        projectHeader.className = 'collapsible-header';
        projectIcon.className = 'material-icons';
        projectIcon.innerText = 'library_books';
        projectBody.className = 'collapsible-body';
        projectOptions.className = 'project-options';
        projectAddTodoBtn.classList = 'pr-addtodo waves-effect waves-light cyan btn-small';
        projectAddTodoBtn.setAttribute("data-btn-type", "add");
        projectAddTodoIco.classList = 'material-icons left';
        projectAddTodoIco.innerText = 'playlist_add';
        projectEditBtn.classList = 'pr-edit waves-effect waves-light btn-small';
        projectEditBtn.setAttribute("data-btn-type", "edit");
        projectEditIco.classList = 'material-icons left';
        projectEditIco.innerText = 'edit';
        projectDeleteBtn.classList = 'pr-delete waves-effect waves-light btn-small';
        projectDeleteBtn.setAttribute("data-btn-type", "delete");
        projectDeleteIco.classList = 'material-icons left';
        projectDeleteIco.innerText = 'delete';

        projectAddTodoBtn.appendChild(projectAddTodoIco);
        projectAddTodoBtn.appendChild(document.createTextNode('add todo'));
        projectEditBtn.appendChild(projectEditIco);
        projectEditBtn.appendChild(document.createTextNode('edit project'));
        projectDeleteBtn.appendChild(projectDeleteIco);
        projectDeleteBtn.appendChild(document.createTextNode('delete project'));
        projectOptions.appendChild(projectAddTodoBtn);
        projectOptions.appendChild(projectEditBtn);
        projectOptions.appendChild(projectDeleteBtn);
        projectBody.appendChild(projectOptions);
        projectHeader.appendChild(projectIcon);
        projectHeader.appendChild(document.createTextNode(project.name));
        projectLi.appendChild(projectHeader);
        projectLi.appendChild(projectBody);

        return projectLi;
    }

    const loadProjectEvents = (projectLi) => {
        const projectDeleteBtn = projectLi.querySelector('a[data-btn-type="delete"]');
        projectDeleteBtn.addEventListener('click', () => removeProject(projectLi.id));
    }

    function saveProject(e) {
        e.preventDefault();
        clearProjectsMessages();
        const project = {
            'name': `${e.target.elements.projectName.value}`,
            'todos': []
        }
        const projectId = ProjectController.addProject(project);
        const projectLi = createProject(project, projectId);
        elem.appendChild(projectLi);
        loadProjectEvents(projectLi);
        collapsibleInstance.open(projectId);
        modalInstance.close();
        e.target.elements.projectName.value = null;
    }

    const removeProject = (projectId) => {
        elem.removeChild(elem.querySelector(`#${projectId}`));
        ProjectController.removeProject(getNumberId(projectId));
        if(!elem.firstChild) {
            showNoProjectsMsg();
        }
    }

    const getNumberId = (elemId) => {
        return parseInt(elemId.slice(2));
    }

    const showNoProjectsMsg = () => {
        const msgPara = document.createElement('p');
        msgPara.className = 'no-projects-msg';
        msgPara.innerText = 'There are no projects.';
        elem.appendChild(msgPara);
    }

    const clearProjectsMessages = () => {
        const msgElem = elem.querySelector('.no-projects-msg');
        if(msgElem) elem.removeChild(msgElem);
    }

    return { renderProjects }
})();

export default DOMController;