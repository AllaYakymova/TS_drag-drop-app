// auto bind decorator
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      return originalMethod.bind(this);
    }
  };
  return adjDescriptor;
}

// validation of form fields
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number
}
function validate(validatableInput: Validatable) {
  let isValid = true;
  if(validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0
  }
  if(validatableInput.minLength !== undefined && typeof validatableInput.value === 'string') {
    isValid = isValid && validatableInput.value.toString().trim().length > validatableInput.minLength
  }
  if(validatableInput.maxLength !== undefined && typeof validatableInput.value === 'string') {
    isValid = isValid && validatableInput.value.toString().trim().length < validatableInput.maxLength
  }
  if(validatableInput.min !== undefined && typeof validatableInput.value === 'number') {
    isValid = isValid && validatableInput.value > validatableInput.min
  }
  if(validatableInput.max !== undefined && typeof validatableInput.value === 'number') {
    isValid = isValid && validatableInput.value < validatableInput.max
  }
  return isValid
}

// ProjectList Class
class ProjectList {
  templateElement: HTMLTemplateElement;
  hastElement: HTMLDivElement;
  element: HTMLElement;

  constructor(private type: 'active' | 'finished') {
    this.templateElement = <HTMLTemplateElement>document.getElementById('project-list')!;
    this.hastElement = document.getElementById('app')! as HTMLDivElement; // the same option of type assignment

    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`;
    this.attach();
    this.renderContent();
  }

  private renderContent() {
    this.element.querySelector('ul')!.id =  `${this.type}-projects-list`;
    this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
  }

  private  attach() {
    this.hastElement.insertAdjacentElement('beforeend', this.element)
  }
}


// ProjectInput class
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hastElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = <HTMLTemplateElement>document.getElementById('project-input')!; // the same option of type assignment
    this.hastElement = document.getElementById('app')! as HTMLDivElement; // the same option of type assignment
    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = 'user-input';

    this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

   const  titleValidatable: Validatable = {
     value: enteredTitle,
     required: true,
     minLength: 5
   };
    const  descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5
    };
    const  peopleValidatable: Validatable = {
      value: enteredPeople,
      required: true,
      min: 1,
      max: 5
    };


    if (!validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)) {
      alert('Invalid input, please try again');
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople]
    }

  }

  private clearInput() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  @autobind // help to make auto bind this in addEventListener
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if(Array.isArray(userInput)) { // check if return array (tuple type)
      const  [title, desc, people] = userInput;
      console.log(title, desc, people);
      this.clearInput();
    }
  }

  private configure() {
    this.element.addEventListener('submit', this.submitHandler)
  }

  private attach() {
    this.hastElement.insertAdjacentElement('afterbegin', this.element)
  }

}

const projectElement = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');
