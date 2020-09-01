const ProjectController = (() => {
    const sampleProjects = [
        {
            'name': 'Default',
            'todos': [
                {
                    'title': 'Go to gym',
                    'description': 'Grow muscles',
                    'done': false
                },
                {
                    'title': 'Parachute jump',
                    'description': 'Parachute jump from the stratosphere',
                    'done': false
                }
            ]
        }
    ];
    
    const getProjects = () => {
        if(!localStorage.getItem('projects')) {
            saveProjects(sampleProjects);
        }
        return JSON.parse(localStorage.getItem('projects'));
    }

    const saveProjects = (projects) => {
        localStorage.setItem('projects', JSON.stringify(projects));
    }

    const getProject = (projectId) => {
        const projects = getProjects();
        return projects[projectId];
    }

    const addProject = (project) => {
        const projects = getProjects();
        const index = projects.push(project) - 1;
        saveProjects(projects);
        return index;
    }

    const editProject = (projectId, project) => {
        const projects = getProjects();
        projects[projectId] = project;
        saveProjects(projects);
    }

    const removeProject = (projectId) => {
        const projects = getProjects();
        projects.splice(projectId, 1);
        saveProjects(projects);
    }

    return { 
        getProjects, 
        getProject, 
        addProject, 
        editProject, 
        removeProject 
    }
})();

export default ProjectController;