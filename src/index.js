import DOMController from './DOMController';

const App = (() => {
    const start = () => {
        DOMController.renderProjects();
    }

    return { start }
})();

App.start();