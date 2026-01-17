
// This file is standalone and only for admin.html
// Admin Dashboard JavaScript
class AdminDashboard {
    constructor() {
        this.courses = [];
        this.students = [];
        this.certificates = [];
        this.currentEditingId = null;
        this.init();
    }

    init() {
        this.loadCoursesFromStorage();
        this.loadSampleData();
        this.bindEvents();
        this.updateDashboard();
        this.renderStudents();
        this.renderCourses();
    }

    loadCoursesFromStorage() {
        const storedCourses = localStorage.getItem('visionX_courses');
        if (storedCourses) {
            this.courses = JSON.parse(storedCourses);
        }
    }

    saveCoursesToStorage() {
        localStorage.setItem('visionX_courses', JSON.stringify(this.courses));
    }

    loadSampleData() {
        // Only load sample data if no courses exist in storage
        if (this.courses.length === 0) {
            this.courses = [
            {
                id: 1,
                title: "Web Development",
                description: "Complete web development course covering HTML, CSS, JavaScript, and modern frameworks",
                instructor: "Gagan Purad",
                category: "web",
                duration: 12,
                modules: [
                    { id: 1, title: "HTML Fundamentals" },
                    { id: 2, title: "CSS Styling" },
                    { id: 3, title: "JavaScript Basics" },
                    { id: 4, title: "React Framework" }
                ],
                thumbnail: "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg",
                createdAt: "2024-01-01T00:00:00.000Z"
            },
            {
                id: 2,
                title: "C Programming",
                description: "Learn C programming from basics to advanced concepts",
                instructor: "Gagan Purad",
                category: "programming",
                duration: 8,
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
                id: 3,
                title: "Python Programming",
                description: "Master Python programming for data science and web development",
                instructor: "Shradha khapra",
                category: "programming",
                duration: 10,
                modules: [
                    { id: 1, title: "Python Basics" },
                    { id: 2, title: "Data Structures" },
                    { id: 3, title: "Object-Oriented Programming" },
                    { id: 4, title: "Libraries and Frameworks" }
                ],
                thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1869px-Python-logo-notext.svg.png",
                createdAt: "2024-01-03T00:00:00.000Z"
            }
        ];
        }

        // Sample students data
        this.students = [
            {
                id: 1,
                name: "Rutvi Mistry",
                email: "rutvimistry2@email.com",
                phone: "+91 9876543210",
                course: "Web Development",
                certificationDate: "2024-01-15",
                status: "certified"
            },
            {
                id: 2,
                name: "Mahi patel",
                email: "mahi2@email.com",
                phone: "+91 9876543211",
                course: "Python Programming",
                certificationDate: "2024-01-10",
                status: "certified"
            },
            {
                id: 3,
                name: "Janvi joshi",
                email: "janvijoshi@email.com",
                phone: "+91 9876543212",
                course: "C Programming",
                certificationDate: "2024-01-08",
                status: "certified"
            },
            {
                id: 4,
                name: "Devanshi patel",
                email: "devanshi@email.com",
                phone: "+91 9876543213",
                course: "Data Analyst",
                certificationDate: "2024-01-12",
                status: "pending"
            }
        ];

        // Generate certificates based on students
        this.generateCertificates();
    }

    generateCertificates() {
        this.certificates = this.students
            .filter(student => student.status === 'certified')
            .map((student, index) => ({
                id: `CERT-${String(index + 1).padStart(4, '0')}`,
                studentId: student.id,
                studentName: student.name,
                course: student.course,
                issueDate: student.certificationDate,
                status: "issued"
            }));
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showSection(section);
            });
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // Student form
        document.getElementById('studentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveStudent();
        });

        // Search functionality
        document.getElementById('studentSearch').addEventListener('input', (e) => {
            this.searchStudents(e.target.value);
        });

        // Course form
        const courseForm = document.getElementById('uploadCourseForm');
        if (courseForm) {
            courseForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Course form submitted'); // Debug log
                this.saveCourse();
            });
        } else {
            console.error('Course form not found!');
        }

        // Course search
        const courseSearch = document.getElementById('courseSearch');
        if (courseSearch) {
            courseSearch.addEventListener('input', (e) => {
                this.searchCourses(e.target.value);
            });
        }
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.admin-content').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        document.getElementById(sectionName).classList.add('active');

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        const navLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (navLink) navLink.classList.add('active');

        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            students: 'Certified Students',
            newcourse: 'Course Management'
        };
        document.getElementById('pageTitle').textContent = titles[sectionName] || 'Dashboard';
    }

    updateDashboard() {
        // Update statistics
        document.getElementById('totalCourses').textContent = this.courses.length;
        document.getElementById('totalStudents').textContent = this.students.filter(s => s.status === 'certified').length;
        document.getElementById('totalCertificates').textContent = this.certificates.length;
        
        const totalStudents = this.courses.reduce((sum, course) => {
            return sum + course.students;
        }, 0);
        document.getElementById('totalRevenue').textContent = totalStudents;
    }


    renderStudents() {
        const tbody = document.getElementById('studentsTable');
        tbody.innerHTML = '';

        if (this.students.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">
                        <i class="fas fa-users"></i>
                        <p>No students found</p>
                    </td>
                </tr>
            `;
            return;
        }

        this.students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.course}</td>
                <td>${new Date(student.certificationDate).toLocaleDateString()}</td>
                <td><span class="badge ${this.getStatusBadgeClass(student.status)}">${student.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="adminDashboard.editStudent(${student.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="adminDashboard.deleteStudent(${student.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }


    getStatusBadgeClass(status) {
        switch (status) {
            case 'certified': return 'badge-success';
            case 'pending': return 'badge-warning';
            case 'incomplete': return 'badge-danger';
            default: return 'badge-warning';
        }
    }


    // Student Management
    openStudentModal(studentId = null) {
        this.currentEditingId = studentId;
        const modal = document.getElementById('studentModal');
        const title = document.getElementById('studentModalTitle');
        const form = document.getElementById('studentForm');
        const courseSelect = document.getElementById('studentCourse');

        // Populate course options
        courseSelect.innerHTML = '<option value="">Select Course</option>';
        this.courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.name;
            option.textContent = course.name;
            courseSelect.appendChild(option);
        });

        if (studentId) {
            title.textContent = 'Edit Student';
            const student = this.students.find(s => s.id === studentId);
            if (student) {
                document.getElementById('studentName').value = student.name;
                document.getElementById('studentEmail').value = student.email;
                document.getElementById('studentPhone').value = student.phone;
                document.getElementById('studentCourse').value = student.course;
                document.getElementById('certificationDate').value = student.certificationDate;
                document.getElementById('studentStatus').value = student.status;
            }
        } else {
            title.textContent = 'Add New Student';
            form.reset();
        }

        modal.classList.add('active');
    }

    closeStudentModal() {
        document.getElementById('studentModal').classList.remove('active');
        this.currentEditingId = null;
    }

    saveStudent() {
        const formData = {
            name: document.getElementById('studentName').value,
            email: document.getElementById('studentEmail').value,
            phone: document.getElementById('studentPhone').value,
            course: document.getElementById('studentCourse').value,
            certificationDate: document.getElementById('certificationDate').value,
            status: document.getElementById('studentStatus').value
        };

        if (this.currentEditingId) {
            // Update existing student
            const index = this.students.findIndex(s => s.id === this.currentEditingId);
            if (index !== -1) {
                this.students[index] = { ...this.students[index], ...formData };
            }
        } else {
            // Add new student
            formData.id = this.students.length > 0 ? Math.max(...this.students.map(s => s.id)) + 1 : 1;
            this.students.push(formData);
        }

        this.generateCertificates();
        this.closeStudentModal();
        this.renderStudents();
        if (typeof this.renderCertificates === 'function') this.renderCertificates();
        this.updateDashboard();
        this.showNotification('Student saved successfully!', 'success');
    }

    editStudent(studentId) {
        this.openStudentModal(studentId);
    }

    deleteStudent(studentId) {
        if (confirm('Are you sure you want to delete this student?')) {
            this.students = this.students.filter(s => s.id !== studentId);
            this.generateCertificates();
            this.renderStudents();
            if (typeof this.renderCertificates === 'function') this.renderCertificates();
            this.updateDashboard();
            this.showNotification('Student deleted successfully!', 'success');
        }
    }


    searchStudents(query) {
        const filteredStudents = this.students.filter(student =>
            student.name.toLowerCase().includes(query.toLowerCase()) ||
            student.email.toLowerCase().includes(query.toLowerCase()) ||
            student.course.toLowerCase().includes(query.toLowerCase())
        );

        const tbody = document.getElementById('studentsTable');
        tbody.innerHTML = '';

        if (filteredStudents.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">
                        <i class="fas fa-search"></i>
                        <p>No students found matching "${query}"</p>
                    </td>
                </tr>
            `;
            return;
        }

        filteredStudents.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.course}</td>
                <td>${new Date(student.certificationDate).toLocaleDateString()}</td>
                <td><span class="badge ${this.getStatusBadgeClass(student.status)}">${student.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="adminDashboard.editStudent(${student.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="adminDashboard.deleteStudent(${student.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }


    // Course Management
    showCourseForm() {
        document.getElementById('courseForm').style.display = 'block';
        window.scrollTo({ top: document.getElementById('courseForm').offsetTop - 20, behavior: 'smooth' });
    }

    hideCourseForm() {
        const courseForm = document.getElementById('courseForm');
        const uploadForm = document.getElementById('uploadCourseForm');
        
        if (courseForm) {
            courseForm.style.display = 'none';
        }
        
        if (uploadForm) {
            uploadForm.reset();
        }
        
        this.resetModules();
    }

    saveCourse() {
        console.log('saveCourse method called'); // Debug log
        
        // Get form elements
        const titleInput = document.getElementById('courseTitle');
        const descriptionInput = document.getElementById('courseDescription');
        const instructorInput = document.getElementById('courseInstructor');
        const categoryInput = document.getElementById('courseCategory');
        const durationInput = document.getElementById('courseDuration');
        const thumbnailInput = document.getElementById('thumbnailUpload');
        
        // Validate required fields
        if (!titleInput || !titleInput.value.trim()) {
            alert('Please enter a course title');
            return;
        }
        if (!descriptionInput || !descriptionInput.value.trim()) {
            alert('Please enter a course description');
            return;
        }
        if (!instructorInput || !instructorInput.value.trim()) {
            alert('Please enter an instructor name');
            return;
        }
        if (!categoryInput || !categoryInput.value) {
            alert('Please select a course category');
            return;
        }
        if (!durationInput || !durationInput.value) {
            alert('Please enter course duration');
            return;
        }
        
        const formData = {
            title: titleInput.value.trim(),
            description: descriptionInput.value.trim(),
            instructor: instructorInput.value.trim(),
            category: categoryInput.value,
            duration: parseInt(durationInput.value),
            thumbnail: thumbnailInput ? thumbnailInput.files[0] : null,
            modules: this.getModulesData()
        };
        
        console.log('Form data:', formData); // Debug log

        // Create course object
        const course = {
            id: this.courses.length > 0 ? Math.max(...this.courses.map(c => c.id)) + 1 : 1,
            title: formData.title,
            description: formData.description,
            instructor: formData.instructor,
            category: formData.category,
            duration: formData.duration,
            modules: formData.modules,
            thumbnail: formData.thumbnail ? URL.createObjectURL(formData.thumbnail) : 'https://via.placeholder.com/300x200?text=Course+Image',
            createdAt: new Date().toISOString()
        };

        this.courses.push(course);
        this.saveCoursesToStorage();
        this.hideCourseForm();
        this.renderCourses();
        this.updateDashboard();
        
        // Show success message
        alert('Course created successfully!');
        this.showNotification('Course created successfully!', 'success');
        
        // Trigger custom event to update index page
        window.dispatchEvent(new CustomEvent('courseUpdated'));
        
        console.log('Course added successfully. Total courses:', this.courses.length);
    }

    getModulesData() {
        const modules = [];
        const moduleItems = document.querySelectorAll('.module-item');
        
        moduleItems.forEach((item, index) => {
            const titleInput = item.querySelector('input[type="text"]');
            const urlInput = item.querySelector('input[type="url"]');
            const descriptionTextarea = item.querySelector('textarea');
            const fileInput = item.querySelector('input[type="file"][accept*="pdf"]');
            const videoInput = item.querySelector('input[type="file"][accept*="video"]');
            
            if (titleInput && titleInput.value.trim()) {
                modules.push({
                    id: parseInt(item.dataset.moduleId) || (index + 1),
                    title: titleInput.value.trim(),
                    description: descriptionTextarea ? descriptionTextarea.value.trim() : '',
                    videoUrl: urlInput ? urlInput.value.trim() : '',
                    file: fileInput ? fileInput.files[0] : null,
                    video: videoInput ? videoInput.files[0] : null,
                    order: index + 1
                });
            }
        });
        
        return modules;
    }

    renderCourses() {
        const courseList = document.getElementById('courseList');
        if (!courseList) return;

        courseList.innerHTML = '';

        if (this.courses.length === 0) {
            courseList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-graduation-cap"></i>
                    <p>No courses found</p>
                </div>
            `;
            return;
        }

        this.courses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.className = 'course-card';
            courseCard.innerHTML = `
                <div class="course-image">
                    <img src="${course.thumbnail}" alt="${course.title}">
                </div>
                <div class="course-content">
                    <h3 class="course-title">${course.title}</h3>
                    <div class="course-meta">
                        <span><i class="fas fa-user"></i> ${course.instructor}</span>
                        <span><i class="fas fa-clock"></i> ${course.modules.length} modules</span>
                        <span><i class="fas fa-tag"></i> ${course.category}</span>
                    </div>
                    <div class="course-actions">
                        <button class="btn btn-primary" onclick="adminDashboard.editCourse(${course.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger" onclick="adminDashboard.deleteCourse(${course.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
            courseList.appendChild(courseCard);
        });
    }

    searchCourses(query) {
        const filteredCourses = this.courses.filter(course =>
            course.title.toLowerCase().includes(query.toLowerCase()) ||
            course.instructor.toLowerCase().includes(query.toLowerCase()) ||
            course.category.toLowerCase().includes(query.toLowerCase())
        );

        const courseList = document.getElementById('courseList');
        if (!courseList) return;

        courseList.innerHTML = '';

        if (filteredCourses.length === 0) {
            courseList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <p>No courses found matching "${query}"</p>
                </div>
            `;
            return;
        }

        filteredCourses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.className = 'course-card';
            courseCard.innerHTML = `
                <div class="course-image">
                    <img src="${course.thumbnail}" alt="${course.title}">
                </div>
                <div class="course-content">
                    <h3 class="course-title">${course.title}</h3>
                    <div class="course-meta">
                        <span><i class="fas fa-user"></i> ${course.instructor}</span>
                        <span><i class="fas fa-clock"></i> ${course.modules.length} modules</span>
                        <span><i class="fas fa-tag"></i> ${course.category}</span>
                    </div>
                    <div class="course-actions">
                        <button class="btn btn-primary" onclick="adminDashboard.editCourse(${course.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger" onclick="adminDashboard.deleteCourse(${course.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
            courseList.appendChild(courseCard);
        });
    }

    editCourse(courseId) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course) return;

        // Populate form with course data
        document.getElementById('courseTitle').value = course.title;
        document.getElementById('courseDescription').value = course.description;
        document.getElementById('courseInstructor').value = course.instructor;
        document.getElementById('courseCategory').value = course.category;
        document.getElementById('courseDuration').value = course.duration;

        // Populate modules
        this.resetModules();
        course.modules.forEach(module => {
            this.addModule(module.title);
        });

        this.showCourseForm();
        this.currentEditingId = courseId;
    }

    deleteCourse(courseId) {
        if (confirm('Are you sure you want to delete this course?')) {
            this.courses = this.courses.filter(c => c.id !== courseId);
            this.saveCoursesToStorage();
            this.renderCourses();
            this.updateDashboard();
            this.showNotification('Course deleted successfully!', 'success');
            
            // Trigger custom event to update index page
            window.dispatchEvent(new CustomEvent('courseUpdated'));
        }
    }

    resetModules() {
        const container = document.getElementById('modulesContainer');
        container.innerHTML = `
            <div class="module-item sortable" data-module-id="1">
                <div class="sort-handle">
                    <i class="fas fa-grip-vertical"></i>
                </div>
                <div class="module-info">
                    <div class="module-header">
                        <span class="module-number">1</span>
                        <div class="module-title-input">
                            <input type="text" class="form-control" placeholder="Module title" required>
                        </div>
                        <div class="module-actions">
                            <button type="button" class="btn btn-danger" onclick="removeModule(this)">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="module-details">
                        <div class="module-link-section">
                            <div class="module-link-uploader" onclick="document.getElementById('moduleFile1').click()">
                                <i class="fas fa-file-upload"></i>
                                <p>Upload Module File</p>
                                <input type="file" id="moduleFile1" accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.avi,.mov" onchange="handleFileUpload(this)">
                            </div>
                            <div class="module-link-uploader" onclick="document.getElementById('moduleVideo1').click()">
                                <i class="fas fa-video"></i>
                                <p>Upload Video</p>
                                <input type="file" id="moduleVideo1" accept="video/*" onchange="handleVideoUpload(this)">
                            </div>
                        </div>
                        <div class="module-link-input">
                            <input type="url" class="form-control" placeholder="Or paste video URL (YouTube, Vimeo, etc.)">
                        </div>
                        <div class="module-description">
                            <textarea class="form-control" placeholder="Module description (optional)"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.initializeSortable();
    }

    initializeSortable() {
        const container = document.getElementById('modulesContainer');
        if (!container) return;

        // Simple drag and drop implementation
        let draggedElement = null;

        container.addEventListener('dragstart', (e) => {
            if (e.target.closest('.sort-handle')) {
                draggedElement = e.target.closest('.module-item');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', draggedElement.outerHTML);
                draggedElement.style.opacity = '0.5';
            }
        });

        container.addEventListener('dragend', (e) => {
            if (draggedElement) {
                draggedElement.style.opacity = '1';
                draggedElement = null;
            }
        });

        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        container.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedElement) {
                const afterElement = getDragAfterElement(container, e.clientY);
                if (afterElement == null) {
                    container.appendChild(draggedElement);
                } else {
                    container.insertBefore(draggedElement, afterElement);
                }
                this.updateModuleNumbers();
            }
        });

        // Make sort handles draggable
        container.querySelectorAll('.sort-handle').forEach(handle => {
            handle.setAttribute('draggable', 'true');
        });
    }

    updateModuleNumbers() {
        const modules = document.querySelectorAll('.module-item');
        modules.forEach((module, index) => {
            const numberElement = module.querySelector('.module-number');
            if (numberElement) {
                numberElement.textContent = index + 1;
            }
            module.dataset.moduleId = index + 1;
        });
    }

    // Utility functions
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#FF9800' : '#2196F3'};
            color: white;
            border-radius: 5px;
            z-index: 3000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            // In a real application, this would clear session and redirect
            window.location.href = 'index.html';
        }
    }
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Add a stub for renderCertificates if not present
AdminDashboard.prototype.renderCertificates = function() { /* No-op for standalone */ };

// Ensure openStudentModal and closeStudentModal are global
window.openStudentModal = function(id) { adminDashboard.openStudentModal(id); };
window.closeStudentModal = function() { adminDashboard.closeStudentModal(); };

// Course management global functions
window.showCourseForm = function() { adminDashboard.showCourseForm(); };
window.hideCourseForm = function() { adminDashboard.hideCourseForm(); };
window.saveCourse = function() { 
    if (adminDashboard) {
        adminDashboard.saveCourse(); 
    } else {
        console.error('AdminDashboard not initialized');
    }
};

window.addModule = function(title = '', description = '', videoUrl = '') {
    const container = document.getElementById('modulesContainer');
    const moduleCount = container.children.length + 1;
    const moduleId = `module${Date.now()}`;
    
    const moduleItem = document.createElement('div');
    moduleItem.className = 'module-item sortable';
    moduleItem.dataset.moduleId = moduleCount;
    moduleItem.innerHTML = `
        <div class="sort-handle">
            <i class="fas fa-grip-vertical"></i>
        </div>
        <div class="module-info">
            <div class="module-header">
                <span class="module-number">${moduleCount}</span>
                <div class="module-title-input">
                    <input type="text" class="form-control" placeholder="Module title" value="${title}" required>
                </div>
                <div class="module-actions">
                    <button type="button" class="btn btn-danger" onclick="removeModule(this)">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="module-details">
                <div class="module-link-section">
                    <div class="module-link-uploader" onclick="document.getElementById('${moduleId}File').click()">
                        <i class="fas fa-file-upload"></i>
                        <p>Upload Module File</p>
                        <input type="file" id="${moduleId}File" accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.avi,.mov" onchange="handleFileUpload(this)">
                    </div>
                    <div class="module-link-uploader" onclick="document.getElementById('${moduleId}Video').click()">
                        <i class="fas fa-video"></i>
                        <p>Upload Video</p>
                        <input type="file" id="${moduleId}Video" accept="video/*" onchange="handleVideoUpload(this)">
                    </div>
                </div>
                <div class="module-link-input">
                    <input type="url" class="form-control" placeholder="Or paste video URL (YouTube, Vimeo, etc.)" value="${videoUrl}">
                </div>
                <div class="module-description">
                    <textarea class="form-control" placeholder="Module description (optional)">${description}</textarea>
                </div>
            </div>
        </div>
    `;
    container.appendChild(moduleItem);
    
    // Make the new module sortable
    const sortHandle = moduleItem.querySelector('.sort-handle');
    if (sortHandle) {
        sortHandle.setAttribute('draggable', 'true');
    }
    
    // Update module numbers
    adminDashboard.updateModuleNumbers();
};

window.removeModule = function(button) {
    const container = document.getElementById('modulesContainer');
    if (container.children.length > 1) {
        button.closest('.module-item').remove();
        // Update module numbers
        adminDashboard.updateModuleNumbers();
    } else {
        alert('A course must have at least one module.');
    }
};

window.handleFileUpload = function(input) {
    const uploader = input.closest('.module-link-uploader');
    if (input.files && input.files[0]) {
        uploader.classList.add('has-file');
        uploader.querySelector('p').textContent = `File: ${input.files[0].name}`;
    }
};

window.handleVideoUpload = function(input) {
    const uploader = input.closest('.module-link-uploader');
    if (input.files && input.files[0]) {
        uploader.classList.add('has-file');
        uploader.querySelector('p').textContent = `Video: ${input.files[0].name}`;
    }
};

// Helper function for drag and drop
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.module-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Initialize admin dashboard when DOM is loaded
let adminDashboard;
document.addEventListener('DOMContentLoaded', () => {
    adminDashboard = new AdminDashboard();
});


 