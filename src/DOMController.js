import 'materialize-css';
import ProjectController from './ProjectController';

const DOMController = (() => {
    const elem = document.querySelector('.collapsible');
    const collapsibleInstance = M.Collapsible.init(elem);
    const projectForm = document.querySelector('#project-form');
    const todoForm = document.querySelector('#todo-form');
    const modalInstance = M.Modal.init(projectForm, {
        onCloseStart: () => (clearProjectForm()),
    });
    const todoModalInstance = M.Modal.init(todoForm, {
        onCloseStart: () => (clearTodoForm()),
    });

    projectForm.onsubmit = addProject.bind();
    todoForm.onsubmit = addTodo.bind();

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
        const projectTodos = document.createElement('ul');

        projectLi.id = `pr-${ id }`;
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
        projectTodos.className = 'collection';

        if(project.todos.length > 0) {
            project.todos.forEach((todo, i) => {
                const todoLi = createTodo(todo, i);
                loadTodoEvents(todoLi);
                projectTodos.appendChild(todoLi);
            });
        }

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
        projectBody.appendChild(projectTodos);
        projectHeader.appendChild(projectIcon);
        projectHeader.appendChild(document.createTextNode(project.name));
        projectLi.appendChild(projectHeader);
        projectLi.appendChild(projectBody);

        return projectLi;
    };

    const loadProjectEvents = (projectLi) => {
        const projectDeleteBtn = projectLi.querySelector('a[data-btn-type="delete"]');
        const projectEditBtn = projectLi.querySelector('a[data-btn-type="edit"]');
        const projectAddTodoBtn = projectLi.querySelector('a[data-btn-type="add"]');

        projectDeleteBtn.addEventListener('click', () => removeProject(projectLi));
        projectEditBtn.addEventListener('click', () => editProject(projectLi));
        projectAddTodoBtn.addEventListener('click', () => loadTodoModal(projectLi));
    };

    function addProject(e) {
        e.preventDefault();
        clearProjectsMessages();

        const project = {
            name: `${e.target.elements.projectName.value}`,
            todos: []
        };

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

    const createTodo = (todo, id) => {
        const todoLi = document.createElement('li');
        const todoDiv = document.createElement('div');
        let todoTitleHTML = '';

        if(todo.isDone === true) {
            todoTitleHTML = `<span id="todo-title" class="done">${ todo.title }</span>`;
        } else {
            todoTitleHTML = `<span id="todo-title">${ todo.title }</span>`;
        }

        todoDiv.innerHTML = `
            ${ todoTitleHTML }
            <a class="secondary-content cursor-pointer ml-10" data-btn-type="delete">
                <i class="material-icons">delete</i>
            </a>
            <a class="secondary-content cursor-pointer" data-btn-type="edit">
                <i class="material-icons">edit</i>
            </a>
        `;

        todoLi.id = `td-${ id }`;
        todoLi.className = 'collection-item';
        todoLi.appendChild(todoDiv);

        return todoLi;
    };

    const loadTodoEvents = (todoLi) => {
        const todoDeleteBtn = todoLi.querySelector('a[data-btn-type="delete"]');
        const todoEditBtn = todoLi.querySelector('a[data-btn-type="edit"]');
        const todoTitleSpan = todoLi.querySelector('span');

        todoDeleteBtn.addEventListener('click', () => removeTodo(todoLi));
        todoEditBtn.addEventListener('click', () => editTodo(todoLi));
        todoTitleSpan.addEventListener('click', () => changeTodoStatus(todoLi));
    };

    const loadTodoModal = (projectLi, todoLi = null) => {
        const projectIdInput = document.querySelector('#todoProjectId');
        projectIdInput.value = projectLi.id;

        if(todoLi != null) {
            const todoIdInput = document.querySelector('#todoId');
            const todoTitle = document.querySelector('#todoTitle');
            const todoTitleLabel = todoTitle.nextElementSibling;
            const todoDescription = document.querySelector('#todoDescription');
            const todoDescriptionLabel = todoDescription.nextElementSibling;
            const todoIsDone = document.querySelector('#todoIsDone');
            const todo = ProjectController.getTodo(
                getNumberId(projectLi.id),
                getNumberId(todoLi.id),
            );

            todoIdInput.value = todoLi.id;
            todoTitle.value = todo.title;
            todoDescription.value = todo.description;
            todoTitleLabel.className = 'active';
            todoDescriptionLabel.className = 'active';
            todoIsDone.checked = todo.isDone;
        }

        todoModalInstance.open();
    }

    function addTodo(e) {
        e.preventDefault();

        const projectId = e.target.elements.todoProjectId.value;
        const todo = {
            title: e.target.elements.todoTitle.value,
            description: e.target.elements.todoDescription.value,
            isDone: e.target.elements.todoIsDone.checked,
        };

        const todoIdInput = e.target.elements.todoId.value;

        if(todoIdInput === 'new') {
            // Add new TODO to project
            const projectTodos = document.querySelector(`#${ projectId }`)
                .querySelector('.collection');
            const todoId = ProjectController.addTodo(getNumberId(projectId), todo);
            const todoLi = createTodo(todo, todoId);
            loadTodoEvents(todoLi);
            projectTodos.appendChild(todoLi);
        } else {
            // Edit existing TODO
            const todoTitleSpan = document.querySelector(`#${ todoIdInput }`)
                .querySelector('#todo-title');
            todoTitleSpan.textContent = todo.title;
            ProjectController.editTodo(
                getNumberId(projectId), 
                getNumberId(todoIdInput), 
                todo,
            );
        }

        todoModalInstance.close();
    }

    const editTodo = (todoLi) => {
        const projectLi = todoLi.closest('li.active');
        loadTodoModal(projectLi, todoLi);
    };

    const removeTodo = (todoLi) => {
        const projectLi = todoLi.closest('li.active');
        const projectTodos = projectLi.querySelector('.collection');
        const projectId = getNumberId(projectLi.id);
        const todoId = getNumberId(todoLi.id);

        ProjectController.removeTodo(projectId, todoId);
        projectTodos.removeChild(todoLi);
    };

    const changeTodoStatus = (todoLi) => {
        const todoTitle = todoLi.querySelector('#todo-title');
        const projectId = getNumberId(todoLi.closest('li.active').id);
        const todoId = getNumberId(todoLi.id);
        const todoIsDone = ProjectController.changeTodoStatus(projectId, todoId);

        if(todoIsDone === true) {
            todoTitle.className = 'done';
        } else {
            todoTitle.removeAttribute('class');
        }
    };

    const clearTodoForm = () => {
        const todoProjectInput = todoForm.querySelector('#todoProjectId');
        const todoId = todoForm.querySelector('#todoId');
        const todoTitle = todoForm.querySelector('#todoTitle');
        const todoTitleLabel = todoTitle.nextElementSibling;
        const todoDescription = todoForm.querySelector('#todoDescription');
        const todoDescriptionLabel = todoDescription.nextElementSibling;
        const todoIsDone = todoForm.querySelector('#todoIsDone');

        todoProjectInput.removeAttribute('value');
        todoId.value = 'new';
        todoTitle.value = null;
        todoTitleLabel.removeAttribute('class');
        todoDescription.value = null;
        todoDescriptionLabel.removeAttribute('class');
        todoIsDone.checked = false;
    };

    return { renderProjects }
})();

export default DOMController;