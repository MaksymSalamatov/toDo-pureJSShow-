window.addEventListener('load', () => {
    
    render()
    newTask()

    function newTask() {
        const form = document.querySelector('#new-task-form');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.querySelector('#new-task-input');
            if (input.value.length > 0) {
                const objOfTask = {
                    title: input.value,
                    id: generateID(),
                };
                sendToLocal(objOfTask)
                taskBuilder(objOfTask)
                switchTitle()
                input.value = ''
            }
        })
    }

    function getLocalArray() {
        const parseArray = localStorage.getItem('data');
        return parseArray ? JSON.parse(parseArray) : [];
    }

    function sendToLocal(item) {
        const arr = getLocalArray()
        const newArr =  [...arr, item]
        localStorage.setItem('data', JSON.stringify(newArr));

    }

    function render() {
        switchTitle()
        const arr = getLocalArray()
        arr ? (arr.forEach(taskBuilder)) : [];
    }
    
    function switchTitle() {
        const title = document.querySelector('.title');
        const arr = getLocalArray()
        if (!arr.length > 0) {
            title.innerHTML = 'No tasks yet'
        } else if(arr.length === 1) {
            title.innerHTML = 'Task'
        }else {
            title.innerHTML = 'Tasks'
        }
    }

    function generateID(){
        return Math.random().toString(36).substr(2, 9);
    }

    function ce(tag, attrs = {}, content = []) {
        const element = document.createElement(tag);
    
        for (const attr in attrs) {
            const value = attrs[attr];
            
            if(attrs.name) {
                element.innerHTML = attrs.name
            }
            element.setAttribute(attr, value);
        }
    
        if (!Array.isArray(content)) {
            content = [content];
        }
    
        content.forEach(child => element.append(child));
    
        return element;
    }

    function taskBuilder({title, id}) {
        const listElement = document.querySelector('#tasks');
        
        const taskInputElement = ce('input', {
            class: 'text', 
            readonly: 'readonly',
            type: 'text',
            value: title
        });

        const taskEditElement = ce('button', {class: 'edit', name: 'Edit'});
        const taskDeleteElement = ce('button', {class: 'delete', name: 'Delete'});
        const taskActionELement = ce('div', {class: 'action'}, [taskEditElement, taskDeleteElement]);
        const taskContentElement = ce('div', {class: 'content'}, taskInputElement);
        const taskElement = ce('div', {class: 'task'}, [taskContentElement, taskActionELement]);

        setTimeout(() => {
            taskElement.classList.add('show');
        }, 100)

        listElement.appendChild(taskElement);

        taskEditElement.addEventListener('click', () => {
            if(taskEditElement.innerText.toLocaleLowerCase() === 'edit') {
                taskInputElement.removeAttribute('readonly');
                taskInputElement.focus();
                taskInputElement.selectionStart = taskInputElement.value.length;
                taskEditElement.innerText = 'Save';
            } else {
                taskInputElement.setAttribute('readonly', 'readonly');
                taskEditElement.innerText = 'Edit';

                const newTitle = taskInputElement.value;
                const itemFromLocalStorage = getLocalArray();
                const filteredArray = itemFromLocalStorage.map(item => {
                    if(item && item.id === id) {
                        item.title = newTitle;
                    }
                    return item;
                })

                localStorage.setItem('data', JSON.stringify(filteredArray));
            }
        });

        taskDeleteElement.addEventListener('click', () => {
            const itemsFromLocalStorage = getLocalArray();
            const filteredArray = itemsFromLocalStorage.filter(item => item.id !== id);
            localStorage.setItem('data', JSON.stringify(filteredArray));
            taskElement.classList.remove('show');
            setTimeout(() => {
                listElement.removeChild(taskElement)
            }, 500);
            switchTitle();
        });

    }
})

