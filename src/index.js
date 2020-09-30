import '../node_modules/materialize-css/dist/css/materialize.min.css';
import DOMController from './DOMController';

const App = (() => {
    const start = () => {
        DOMController.renderProjects();
    }

    return { start }
})();

App.start();