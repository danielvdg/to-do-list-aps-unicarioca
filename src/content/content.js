 const todoInput = document.getElementById('todo-input');
        const addBtn = document.getElementById('add-btn');
        const todoList = document.getElementById('todo-list');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const taskCount = document.getElementById('task-count');

        let todos = JSON.parse(localStorage.getItem('todos')) || [];
        let currentFilter = 'all';

        function saveTodos() {
            localStorage.setItem('todos', JSON.stringify(todos));
        }

        function addTodo() {
            const text = todoInput.value.trim();
            
            if (text === '') {
                alert('Por favor, digite uma tarefa!');
                return;
            }

            const todo = {
                id: Date.now(),
                text: text,
                completed: false
            };

            todos.push(todo);
            saveTodos();
            
            todoInput.value = '';
            renderTodos();
        }

        function deleteTodo(id) {
            todos = todos.filter(todo => todo.id !== id);
            saveTodos();
            renderTodos();
        }

        function toggleTodo(id) {
            const todo = todos.find(todo => todo.id === id);
            if (todo) {
                todo.completed = !todo.completed;
                saveTodos();
                renderTodos();
            }
        }

        function renderTodos() {
            todoList.innerHTML = '';

            let filteredTodos = todos;
            if (currentFilter === 'active') {
                filteredTodos = todos.filter(todo => !todo.completed);
            } else if (currentFilter === 'completed') {
                filteredTodos = todos.filter(todo => todo.completed);
            }

            if (filteredTodos.length === 0) {
                todoList.innerHTML = '<div class="empty-message">Nenhuma tarefa encontrada</div>';
            } else {
                filteredTodos.forEach(todo => {
                    const li = document.createElement('li');
                    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                    
                    li.innerHTML = `
                        <input 
                            type="checkbox" 
                            class="todo-checkbox" 
                            ${todo.completed ? 'checked' : ''}
                            onchange="toggleTodo(${todo.id})"
                        >
                        <span class="todo-text">${todo.text}</span>
                        <button class="delete-btn" onclick="deleteTodo(${todo.id})">Deletar</button>
                    `;
                    
                    todoList.appendChild(li);
                });
            }

            updateTaskCount();
        }

        function updateTaskCount() {
            const activeTasks = todos.filter(todo => !todo.completed).length;
            taskCount.textContent = `${activeTasks} ${activeTasks === 1 ? 'tarefa ativa' : 'tarefas ativas'}`;
        }

        addBtn.addEventListener('click', addTodo);

        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTodo();
            }
        });

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.dataset.filter;
                renderTodos();
            });
        });

        renderTodos();