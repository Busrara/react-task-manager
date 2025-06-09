import { useState } from 'react'
import { Plus, Edit2, Trash2, Check } from 'lucide-react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState('all')
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')

  const addTask = () => {
    if (inputValue.trim()) {
      const newTask = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date()
      }
      setTasks([newTask, ...tasks])
      setInputValue('')
    }
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const startEditing = (id, text) => {
    setEditingId(id)
    setEditingText(text)
  }

  const saveEdit = (id) => {
    if (editingText.trim()) {
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, text: editingText.trim() } : task
      ))
    }
    setEditingId(null)
    setEditingText('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingText('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask()
    }
  }

  const handleEditKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      saveEdit(id)
    } else if (e.key === 'Escape') {
      cancelEdit()
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    active: tasks.filter(task => !task.completed).length
  }

  return (
    <div className="app-container">
      <div className="header">
        <h1>✨ Task Manager</h1>
        <p>Organize your life, one task at a time</p>
      </div>
      
      <div className="task-input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="What needs to be done?"
          className="task-input"
        />
        <button onClick={addTask} className="add-button">
          <Plus size={20} />
          Add Task
        </button>
      </div>
      
      {tasks.length > 0 && (
        <div className="stats">
          <div className="stat-item">
            <span className="stat-number">{stats.total}</span>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.active}</span>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.completed}</span>
            <div className="stat-label">Completed</div>
          </div>
        </div>
      )}
      
      {tasks.length > 0 && (
        <div className="filter-buttons">
          <button 
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-button ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button 
            className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      )}
      
      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              {filter === 'completed' ? '🎉' : filter === 'active' ? '📝' : '🌟'}
            </div>
            <h3>
              {filter === 'completed' 
                ? 'No completed tasks yet' 
                : filter === 'active' 
                ? 'No active tasks' 
                : 'No tasks yet'}
            </h3>
            <p>
              {filter === 'completed' 
                ? 'Complete some tasks to see them here!' 
                : filter === 'active' 
                ? 'All tasks are completed! 🎉' 
                : 'Add your first task to get started'}
            </p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <div className="task-content">
                <div 
                  className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                  onClick={() => toggleTask(task.id)}
                >
                  {task.completed && <Check size={14} color="white" />}
                </div>
                
                {editingId === task.id ? (
                  <>
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyPress={(e) => handleEditKeyPress(e, task.id)}
                      className="edit-input"
                      autoFocus
                    />
                    <div className="edit-actions">
                      <button 
                        onClick={() => saveEdit(task.id)}
                        className="action-button save-button"
                        title="Save"
                      >
                        <Check size={16} />
                      </button>
                      <button 
                        onClick={cancelEdit}
                        className="action-button cancel-button"
                        title="Cancel"
                      >
                        ✕
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className={`task-text ${task.completed ? 'completed' : ''}`}>
                      {task.text}
                    </span>
                    <div className="task-actions">
                      <button 
                        onClick={() => startEditing(task.id, task.text)}
                        className="action-button edit-button"
                        title="Edit task"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="action-button delete-button"
                        title="Delete task"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App
