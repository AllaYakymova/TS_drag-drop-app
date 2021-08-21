import autobind from "../decorators/autobind.js";
import Component from "./base-component.js";
import {DragTarget} from "../models/drag-drop.js";
import Project, {ProjectStatus} from "../models/project.js";
import ProjectItem from "./project-item.js";
import {projectState} from "../state/project-state.js";

// ProjectList Class
export default class ProjectList extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget {
  assignedProject: Project[];

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`);
    this.assignedProject = [];

    this.configure();
    this.renderContent();
  }

  configure(): void {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    this.element.addEventListener('drop', this.dropHandler);
    projectState.addListener((projects: Project[]) => {
      this.assignedProject = projects.filter(item => {
        if (this.type === 'active') {
          return item.status === ProjectStatus.Active
        } else {
          return item.status === ProjectStatus.Finished
        }
      });
      this.renderProject()
    });
  }

  renderContent() {
    this.element.querySelector('ul')!.id = `${this.type}-projects-list`;
    this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
  }

  private renderProject() {
    const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
    listEl.innerHTML = '';
    for (const projectItem of this.assignedProject) {
      new ProjectItem(this.element.querySelector('ul')!.id, projectItem);
    }
  }

  @autobind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.add('droppable');
    }
  }

  @autobind
  dropHandler(event: DragEvent): void {
    const projectId = event.dataTransfer!.getData('text/plain');
    projectState.moveProject(projectId, this.type === 'active' ?
      ProjectStatus.Active : ProjectStatus.Finished);
  }

  @autobind
  dragLeaveHandler(_: DragEvent): void {
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.remove('droppable');
  }
}
