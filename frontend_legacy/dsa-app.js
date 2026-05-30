const { useState, useEffect } = React;

// Navbar Component
function DSANavbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
            <div className="container">
                <a className="navbar-brand" href="/" style={{ fontSize: '1.5rem' }}>
                    🎓 A1 Learner - DSA
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="/">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" href="/dsa.html">DSA Topics</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/#courses">All Courses</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

// Filter Component
function DSAFilters({ categories, selectedCategory, selectedDifficulty, onCategoryChange, onDifficultyChange }) {
    return (
        <div className="filter-section">
            <div className="row">
                <div className="col-md-6">
                    <label className="form-label"><strong>Filter by Category:</strong></label>
                    <select 
                        className="form-select" 
                        value={selectedCategory} 
                        onChange={(e) => onCategoryChange(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-6">
                    <label className="form-label"><strong>Filter by Difficulty:</strong></label>
                    <select 
                        className="form-select" 
                        value={selectedDifficulty} 
                        onChange={(e) => onDifficultyChange(e.target.value)}
                    >
                        <option value="">All Difficulties</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

// Topic Card Component
function DSATopicCard({ topic, onTopicClick }) {
    const getDifficultyClass = (difficulty) => {
        switch(difficulty.toLowerCase()) {
            case 'easy': return 'difficulty-easy';
            case 'medium': return 'difficulty-medium';
            case 'hard': return 'difficulty-hard';
            default: return '';
        }
    };

    const getDifficultyBadgeClass = (difficulty) => {
        switch(difficulty.toLowerCase()) {
            case 'easy': return 'bg-success';
            case 'medium': return 'bg-warning text-dark';
            case 'hard': return 'bg-danger';
            default: return 'bg-secondary';
        }
    };

    return (
        <div className="col-md-6 col-lg-4 mb-4">
            <div 
                className={`card topic-card h-100 dsa-category ${getDifficultyClass(topic.difficulty)}`}
                onClick={() => onTopicClick(topic)}
                style={{ cursor: 'pointer' }}
            >
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title">{topic.name}</h5>
                        <span className={`badge ${getDifficultyBadgeClass(topic.difficulty)} complexity-badge`}>
                            {topic.difficulty}
                        </span>
                    </div>
                    <p className="text-muted mb-2">
                        <small>📂 {topic.category}</small>
                    </p>
                    <p className="card-text">{topic.description}</p>
                    <div className="row">
                        <div className="col-6">
                            <small className="text-muted">
                                ⏱️ Time: <span className="badge bg-info complexity-badge">{topic.timeComplexity}</span>
                            </small>
                        </div>
                        <div className="col-6">
                            <small className="text-muted">
                                💾 Space: <span className="badge bg-info complexity-badge">{topic.spaceComplexity}</span>
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Topic Detail Modal Component
function TopicDetailModal({ topic, isOpen, onClose }) {
    if (!isOpen || !topic) return null;

    return (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
            <div className="modal-dialog modal-lg" onClick={e => e.stopPropagation()}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{topic.name}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <span className="badge bg-primary me-2">{topic.category}</span>
                            <span className={`badge ${
                                topic.difficulty === 'Easy' ? 'bg-success' : 
                                topic.difficulty === 'Medium' ? 'bg-warning text-dark' : 'bg-danger'
                            }`}>{topic.difficulty}</span>
                        </div>
                        
                        <p><strong>Description:</strong> {topic.description}</p>
                        
                        <div className="row mb-3">
                            <div className="col-6">
                                <p><strong>Time Complexity:</strong> <code>{topic.timeComplexity}</code></p>
                            </div>
                            <div className="col-6">
                                <p><strong>Space Complexity:</strong> <code>{topic.spaceComplexity}</code></p>
                            </div>
                        </div>

                        <div className="mb-3">
                            <strong>Explanation:</strong>
                            <p>{topic.explanation}</p>
                        </div>

                        <div className="mb-3">
                            <strong>Code Example:</strong>
                            <div className="code-block">
                                <pre>{topic.codeExample}</pre>
                            </div>
                        </div>

                        {topic.applications && topic.applications.length > 0 && (
                            <div className="mb-3">
                                <strong>Applications:</strong>
                                <ul>
                                    {topic.applications.map((app, index) => (
                                        <li key={index}>{app}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {topic.relatedTopics && topic.relatedTopics.length > 0 && (
                            <div className="mb-3">
                                <strong>Related Topics:</strong>
                                <div>
                                    {topic.relatedTopics.map((relatedTopic, index) => (
                                        <span key={index} className="badge bg-secondary me-1 mb-1">{relatedTopic}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Category Section Component
function CategorySection({ category, topics, onTopicClick }) {
    return (
        <div className="mb-5">
            <div className="d-flex align-items-center mb-3">
                <h3 className="me-3">{category}</h3>
                <span className="badge bg-primary">{topics.length} topics</span>
            </div>
            <div className="row">
                {topics.map(topic => (
                    <DSATopicCard key={topic._id || topic.name} topic={topic} onTopicClick={onTopicClick} />
                ))}
            </div>
        </div>
    );
}

// Main DSA App Component
function DSAApp() {
    const [topics, setTopics] = useState([]);
    const [filteredTopics, setFilteredTopics] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDSATopics();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [topics, selectedCategory, selectedDifficulty]);

    const fetchDSATopics = async () => {
        try {
            const response = await fetch('/api/dsa-topics');
            if (response.ok) {
                const data = await response.json();
                setTopics(data);
                
                // Extract unique categories
                const uniqueCategories = [...new Set(data.map(topic => topic.category))];
                setCategories(uniqueCategories);
            } else {
                console.error('Failed to fetch DSA topics');
            }
        } catch (error) {
            console.error('Error fetching DSA topics:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = topics;
        
        if (selectedCategory) {
            filtered = filtered.filter(topic => topic.category === selectedCategory);
        }
        
        if (selectedDifficulty) {
            filtered = filtered.filter(topic => topic.difficulty === selectedDifficulty);
        }
        
        setFilteredTopics(filtered);
    };

    const handleTopicClick = (topic) => {
        setSelectedTopic(topic);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTopic(null);
    };

    const groupTopicsByCategory = (topics) => {
        return topics.reduce((groups, topic) => {
            const category = topic.category;
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(topic);
            return groups;
        }, {});
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const groupedTopics = groupTopicsByCategory(filteredTopics);

    return (
        <div>
            <DSANavbar />
            
            <div className="container py-5">
                <div className="text-center mb-5">
                    <h1 className="display-4">Data Structures & Algorithms</h1>
                    <p className="lead">Master DSA concepts with detailed explanations and code examples</p>
                    <p className="text-muted">Total Topics: <strong>{topics.length}</strong></p>
                </div>

                <DSAFilters 
                    categories={categories}
                    selectedCategory={selectedCategory}
                    selectedDifficulty={selectedDifficulty}
                    onCategoryChange={setSelectedCategory}
                    onDifficultyChange={setSelectedDifficulty}
                />

                {Object.keys(groupedTopics).length === 0 ? (
                    <div className="text-center py-5">
                        <p className="lead">No topics found matching your criteria.</p>
                        <button 
                            className="btn btn-primary" 
                            onClick={() => {
                                setSelectedCategory('');
                                setSelectedDifficulty('');
                            }}
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    Object.entries(groupedTopics).map(([category, categoryTopics]) => (
                        <CategorySection 
                            key={category} 
                            category={category} 
                            topics={categoryTopics} 
                            onTopicClick={handleTopicClick} 
                        />
                    ))
                )}
            </div>

            <TopicDetailModal 
                topic={selectedTopic} 
                isOpen={isModalOpen} 
                onClose={closeModal} 
            />
        </div>
    );
}

// Render the DSA app
ReactDOM.render(<DSAApp />, document.getElementById('root'));
