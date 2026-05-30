const { useState, useEffect } = React;

// Navigation Component
function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
            <div className="container">
                <a className="navbar-brand" href="#" style={{ fontSize: '1.5rem' }}>
                    🎓 A1 Learner
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="#home">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#courses">Courses</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/dsa.html">DSA Topics</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#about">About</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

// Hero Section Component
function HeroSection() {
    return (
        <section className="hero-section text-center" id="home">
            <div className="container">
                <h1 className="display-4 mb-4">Learn Engineering the Smart Way</h1>
                <p className="lead mb-4">Master engineering concepts with interactive courses and hands-on projects</p>
                <button className="btn btn-light btn-lg btn-custom">Get Started</button>
            </div>
        </section>
    );
}

// Course Card Component
function CourseCard({ course }) {
    return (
        <div className="col-md-4 mb-4">
            <div className="card course-card h-100">
                <div className="card-body">
                    <h5 className="card-title">📚 {course.title}</h5>
                    <p className="card-text">{course.description}</p>
                    {course.link ? (
                        <a href={course.link} className="btn btn-primary">Start Learning</a>
                    ) : (
                        <button className="btn btn-primary">Learn More</button>
                    )}
                </div>
            </div>
        </div>
    );
}

// Courses Section Component
function CoursesSection() {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        // Sample courses data
        setCourses([
            {
                id: 1,
                title: "Mechanical Engineering Basics",
                description: "Learn fundamental concepts of mechanical engineering including thermodynamics and mechanics."
            },
            {
                id: 2,
                title: "Electrical Circuits",
                description: "Master electrical circuit analysis, Ohm's law, and basic electronic components."
            },
            {
                id: 3,
                title: "Computer Programming",
                description: "Introduction to programming concepts using modern languages and frameworks."
            },
            {
                id: 4,
                title: "Civil Engineering",
                description: "Structural analysis, construction materials, and project management fundamentals."
            },
            {
                id: 5,
                title: "Data Structures & Algorithms",
                description: "Master DSA with interactive examples, code snippets, and complexity analysis.",
                link: "/dsa.html"
            },
            {
                id: 6,
                title: "Engineering Mathematics",
                description: "Mathematical concepts essential for all engineering disciplines."
            }
        ]);
    }, []);

    return (
        <section className="py-5" id="courses">
            <div className="container">
                <h2 className="text-center mb-5">Featured Courses</h2>
                <div className="row">
                    {courses.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </div>
        </section>
    );
}

// Footer Component
function Footer() {
    return (
        <footer className="bg-dark text-white py-4 mt-5">
            <div className="container text-center">
                <p>&copy; 2024 A1 Learner. All rights reserved.</p>
                <p>Building the future of engineering education 🚀</p>
            </div>
        </footer>
    );
}

// Main App Component
function App() {
    return (
        <div>
            <Navbar />
            <HeroSection />
            <CoursesSection />
            <Footer />
        </div>
    );
}

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));
