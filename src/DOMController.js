import 'materialize-css';
import ProjectController from './ProjectController';

const DOMController = (() => {
    const elem = document.querySelector('.collapsible');
    const collapsibleInstance = M.Collapsible.init(elem);
    const elems = document.querySelectorAll('.modal');
    const modalInstance = M.Modal.init(elems, {
        onCloseStart: () => (clearProjectForm()),
    })[0];
    const projectForm = document.querySelector('#project-form');

    projectForm.onsubmit = addProject.bind();

    const renderProjects = () => {
        const projects = ProjectController.getProjects();

        if(projects.length > 0) {
            clearProjectsMessages();
            projects.forEach((project, i) => {
                const projectLi = createProject(project, i);
                loadProjectEvents(projectLi);
                elem.appendChild(projectLi);
            });
            collapsibleInstance.open(0);
        } else {
            showNoProjectsMsg();
        }
    };

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
    };

    const loadProjectEvents = (projectLi) => {
        const projectDeleteBtn = projectLi.querySelector('a[data-btn-type="delete"]');
        const projectEditBtn = projectLi.querySelector('a[data-btn-type="edit"]');

        projectDeleteBtn.addEventListener('click', () => removeProject(projectLi));
        projectEditBtn.addEventListener('click', () => editProject(projectLi));
    };

    function addProject(e) {
        e.preventDefault();
        clearProjectsMessages();

        const project = {
            'name': `${e.target.elements.projectName.value}`,
            'todos': []
        }

        if (e.target.elements.projectId.value === 'new') {
            // Add new project
            const projectId = ProjectController.addProject(project);
            const projectLi = createProject(project, projectId);

            loadProjectEvents(projectLi);
            elem.appendChild(projectLi);
            collapsibleInstance.open(projectId);
        } else {
            // Edit existing project
            const projectId = e.target.elements.projectId.value;
            const projectHeader = document.querySelector(`#pr-${projectId}`).firstChild;

            ProjectController.editProject(projectId, project);
            projectHeader.innerHTML = (
                '<i class="material-icons">library_books</i>' 
                + project.name
            );
        }

        modalInstance.close();
    }

    const editProject = (projectLi) => {
        const projectId = getNumberId(projectLi.id);
        const project = ProjectController.getProject(projectId);
        const projectIdInput = document.querySelector('input#projectId');
        const projectNameInput = document.querySelector('input#projectName');
        const projectNameLabel = projectNameInput.nextElementSibling;

        projectIdInput.value = projectId;
        projectNameInput.value = project.name;
        projectNameLabel.className = 'active';

        modalInstance.open();
    };

    const removeProject = (projectLi) => {
        elem.removeChild(projectLi);
        ProjectController.removeProject(getNumberId(projectLi.id));
        
        if(!elem.firstChild) {
            showNoProjectsMsg();
        } else {
            collapsibleInstance.open(0);
        }
    };

    const getNumberId = (elemId) => {
        return Number(elemId.slice(3));
    };

    const showNoProjectsMsg = () => {
        const msgPara = document.createElement('p');

        msgPara.className = 'no-projects-msg';
        msgPara.innerText = 'There are no projects.';
        elem.appendChild(msgPara);
    };

    const clearProjectsMessages = () => {
        const msgElem = elem.querySelector('.no-projects-msg');
        if(msgElem) elem.removeChild(msgElem);
    };

    function clearProjectForm() {
        const projectIdInput = document.querySelector('input#projectId');
        const projectNameInput = document.querySelector('input#projectName');
        const projectNameLabel = projectNameInput.nextElementSibling;
        
        projectIdInput.value = 'new';
        projectNameInput.value = null;
        projectNameLabel.removeAttribute('class');
    };

    return { renderProjects }
})();

export default DOMController;