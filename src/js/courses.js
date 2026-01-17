// Course Management for Index Page
class CourseManager {
    constructor() {
        this.courses = [];
        this.init();
    }

    init() {
        this.loadCoursesFromStorage();
        this.renderCourses();
    }

    loadCoursesFromStorage() {
        const storedCourses = localStorage.getItem('visionX_courses');
        if (storedCourses) {
            this.courses = JSON.parse(storedCourses);
        } else {
            // Load default courses if no stored courses
            this.loadDefaultCourses();
        }
    }

    loadDefaultCourses() {
        this.courses = [
            {
                id: 1,
                title: "C Programming",
                description: "Learn C programming from basics to advanced concepts",
                instructor: "Gagan Purad",
                category: "programming",
                duration: 3,
                modules: [
                    { id: 1, title: "Introduction to C" },
                    { id: 2, title: "Variables and Data Types" },
                    { id: 3, title: "Control Structures" },
                    { id: 4, title: "Functions" }
                ],
                thumbnail: "https://upload.wikimedia.org/wikipedia/commons/1/19/C_Logo.png",
                createdAt: "2024-01-02T00:00:00.000Z"
            },
            {
                id: 2,
                title: "Python Programming",
                description: "Master Python programming for data science and web development",
                instructor: "Shardha Mem",
                category: "programming",
                duration: 3,
                modules: [
                    { id: 1, title: "Python Basics" },
                    { id: 2, title: "Data Structures" },
                    { id: 3, title: "Object-Oriented Programming" },
                    { id: 4, title: "Libraries and Frameworks" },
                    { id: 5, title: "Web Development with Django" },
                    { id: 6, title: "Data Analysis with Pandas" },
                    { id: 7, title: "Machine Learning Basics" }
                ],
                thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1869px-Python-logo-notext.svg.png",
                createdAt: "2024-01-03T00:00:00.000Z"
            },
            {
                id: 3,
                title: "Personality Development",
                description: "Learn Personality development skills",
                instructor: "Sandeep Maheshwari",
                category: "personal-development",
                duration: 5,
                modules: [
                    { id: 1, title: "Improve Your Sense of Humour" },
                    { id: 2, title: "Confident Body Language Tips" },
                    { id: 3, title: "Confidence for Job Interview" },
                    { id: 4, title: "Smart Dressing Sense & Hygiene" },
                    { id: 5, title: "Speak English with Confidence" },
                    { id: 6, title: "Extraordinary Communication Skills" },
                    { id: 7, title: "How to Build Self Confidence" }
                ],
                thumbnail: "./assets/images/personality.jpg",
                createdAt: "2024-01-04T00:00:00.000Z"
            }
        ];
    }

    renderCourses() {
        const container = document.getElementById('coursesContainer');
        if (!container) return;

        container.innerHTML = '';

        if (this.courses.length === 0) {
            container.innerHTML = `
                <div class="no-courses">
                    <h3>No courses available at the moment</h3>
                    <p>Check back soon for new courses!</p>
                </div>
            `;
            return;
        }

        this.courses.forEach((course, index) => {
            const courseElement = document.createElement('div');
            courseElement.className = `course ${index % 2 === 1 ? 'alter-course' : ''}`;
            
            courseElement.innerHTML = `
                <img src="${course.thumbnail}" alt="${course.title}" onerror="this.src='https://via.placeholder.com/300x200?text=Course+Image'">
                <div class="course-info">
                    <h3>${course.title}</h3>
                    <p class="course-instructor">Instructor: ${course.instructor}</p>
                    <p class="course-duration">Duration: ${course.duration} ${course.duration === 1 ? 'Week' : 'Month' + (course.duration > 1 ? 's' : '')}</p>
                    <p class="course-modules">Modules: ${course.modules.length}</p>
                    <p class="course-description">${course.description}</p>
                    <a href="./enroll.html?course=${course.id}">
                        <button data-translate="homepage.enrollNow">Enroll Now</button>
                    </a>
                </div>
            `;
            
            container.appendChild(courseElement);
        });
    }

    // Method to refresh courses (can be called from admin)
    refreshCourses() {
        this.loadCoursesFromStorage();
        this.renderCourses();
    }
}

// Initialize course manager when DOM is loaded
let courseManager;
document.addEventListener('DOMContentLoaded', () => {
    courseManager = new CourseManager();
});

// Listen for storage changes to update courses when admin adds new ones
window.addEventListener('storage', (e) => {
    if (e.key === 'visionX_courses' && courseManager) {
        courseManager.refreshCourses();
    }
});

// Listen for custom events from admin page
window.addEventListener('courseUpdated', () => {
    if (courseManager) {
        courseManager.refreshCourses();
    }
});
