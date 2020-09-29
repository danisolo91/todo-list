const ProjectController = (() => {
    const sampleProjects = [
        {
            name: 'Default',
            todos: [
                {
                    title: 'Go to gym',
                    description: 'Grow muscles',
                    isDone: false
                },
                {
                    title: 'Parachute jump',
                    description: 'Parachute jump from the stratosphere',
                    isDone: false
                }
            ]
        }
    ];
    
    const getProjects = () => {
        if(!localStorage.getItem('projects')) {
            saveProjects(sampleProjects);
        }
        return JSON.parse(localStorage.getItem('projects'));
    };

    const saveProjects = (projects) => {
        localStorage.setItem('projects', JSON.stringify(projects));
    };

    const getProject = (projectId) => {
        const projects = getProjects();
        return projects[projectId];
    };

    const addProject = (project) => {
        const projects = getProjects();
        const index = projects.push(project) - 1;
        saveProjects(projects);
        return index;
    };

    const editProject = (projectId, project) => {
        const projects = getProjects();
        projects[projectId].name = project.name;
        saveProjects(projects);
    };

    const removeProject = (projectId) => {
        const projects = getProjects();
        projects.splice(projectId, 1);
        saveProjects(projects);
    };

    const getTodo = (projectId, todoId) => {
        const projects = getProjects();
        return projects[projectId].todos[todoId];
    };

    const addTodo = (projectId, todo) => {
        const projects = getProjects();
        const index = projects[projectId].todos.push(todo) - 1;
        saveProjects(projects);
        return index;
    };

    const editTodo = (projectId, todoId, todo) => {
        const projects = getProjects();
        projects[projectId].todos[todoId] = todo;
        saveProjects(projects);
    };

    const changeTodoStatus = (projectId, todoId) => {
        const projects = getProjects();
        let result = false;
        if(projects[projectId].todos[todoId].isDone === false) {
            projects[projectId].todos[todoId].isDone = true;
            result  = true;
        } else {
            projects[projectId].todos[todoId].isDone = false;
        }
        saveProjects(projects);
        return result;
    };

    const removeTodo = (projectId, todoId) => {
        const projects = getProjects();
        projects[projectId].todos.splice(todoId, 1);
        saveProjects(projects);
    };

    return { 
        getProjects, 
        getProject, 
        addProject, 
        editProject, 
        removeProject,
        getTodo,
        addTodo,
        editTodo,
        changeTodoStatus,
        removeTodo,
    }
})();

export default ProjectController;