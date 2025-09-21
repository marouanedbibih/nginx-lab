const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const INSTANCE_ID = process.env.INSTANCE_ID || 'standalone';

// Helper function to log with instance ID
const logWithInstance = (message, data = null) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [Instance ${INSTANCE_ID}] ${message}`;
    
    if (data) {
        console.log(logMessage, data);
    } else {
        console.log(logMessage);
    }
};

// Middleware to serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname)));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    logWithInstance(`${req.method} ${req.path} - ${req.ip}`);
    next();
});

// Route to serve the main HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API route for contact form submission
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    
    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: 'Please fill in all fields'
        });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please enter a valid email address'
        });
    }
    
    // Log the contact form submission (in a real app, you'd save to database)
    logWithInstance('New contact form submission received');
    logWithInstance('Contact details:', {
        name: name,
        email: email,
        message: message
    });
    
    // Simulate processing time
    setTimeout(() => {
        res.json({
            success: true,
            message: 'Thank you for your message! We\'ll get back to you soon.'
        });
    }, 1000);
});

// API route to get bootcamp statistics
app.get('/api/stats', (req, res) => {
    const stats = {
        students: 500,
        jobPlacement: 95,
        weeks: 12,
        graduates: 500,
        partnerCompanies: 50,
        averageRating: 4.9,
        averageSalary: 95000
    };
    
    res.json(stats);
});

// API route to get curriculum information
app.get('/api/curriculum', (req, res) => {
    const curriculum = [
        {
            week: "1-2",
            title: "Foundation",
            description: "Linux fundamentals, Git version control, and basic networking concepts",
            topics: ["Linux Basics", "Git & GitHub", "Networking Fundamentals", "Command Line"]
        },
        {
            week: "3-4",
            title: "Containerization",
            description: "Docker fundamentals, container orchestration basics, and best practices",
            topics: ["Docker Basics", "Docker Compose", "Container Best Practices", "Registry Management"]
        },
        {
            week: "5-6",
            title: "Kubernetes",
            description: "Kubernetes architecture, pods, services, deployments, and Helm charts",
            topics: ["K8s Architecture", "Pods & Services", "Deployments", "Helm Charts"]
        },
        {
            week: "7-8",
            title: "CI/CD",
            description: "Jenkins, GitLab CI, automated testing, and deployment strategies",
            topics: ["Jenkins", "GitLab CI", "Automated Testing", "Deployment Strategies"]
        },
        {
            week: "9-10",
            title: "Infrastructure as Code",
            description: "Terraform, Ansible, and infrastructure automation",
            topics: ["Terraform", "Ansible", "Infrastructure Automation", "Cloud Providers"]
        },
        {
            week: "11-12",
            title: "Monitoring & Security",
            description: "Grafana, Prometheus, security best practices, and final project",
            topics: ["Grafana", "Prometheus", "Security Best Practices", "Final Project"]
        }
    ];
    
    res.json(curriculum);
});

// API route to get tools information
app.get('/api/tools', (req, res) => {
    const tools = [
        {
            name: "Docker",
            image: "imgs/docker.png",
            description: "Containerization platform for building, shipping, and running applications",
            category: "Containerization"
        },
        {
            name: "Kubernetes",
            image: "imgs/kubernetes-logo.svg.png",
            description: "Container orchestration platform for managing containerized applications",
            category: "Orchestration"
        },
        {
            name: "Jenkins",
            image: "imgs/jenkins-logo.svg.png",
            description: "Open-source automation server for CI/CD pipelines",
            category: "CI/CD"
        },
        {
            name: "Terraform",
            image: "imgs/terraform.png",
            description: "Infrastructure as Code tool for building, changing, and versioning infrastructure",
            category: "Infrastructure as Code"
        },
        {
            name: "ArgoCD",
            image: "imgs/argo-cd.png",
            description: "Declarative GitOps continuous delivery tool for Kubernetes",
            category: "GitOps"
        },
        {
            name: "Helm",
            image: "imgs/helm.png",
            description: "The package manager for Kubernetes applications",
            category: "Package Management"
        },
        {
            name: "GitLab",
            image: "imgs/gitlab.png",
            description: "Complete DevOps platform with integrated CI/CD capabilities",
            category: "DevOps Platform"
        },
        {
            name: "Grafana",
            image: "imgs/grafana.png",
            description: "Analytics and monitoring platform for metrics and logs",
            category: "Monitoring"
        },
        {
            name: "Harbor",
            image: "imgs/harbor-logo.png",
            description: "Enterprise-grade container registry with security and compliance features",
            category: "Container Registry"
        },
        {
            name: "K3s",
            image: "imgs/k3s.png",
            description: "Lightweight Kubernetes distribution for edge and IoT",
            category: "Lightweight K8s"
        },
        {
            name: "Longhorn",
            image: "imgs/longhorn-logo.png",
            description: "Cloud-native distributed block storage for Kubernetes",
            category: "Storage"
        },
        {
            name: "RKE2",
            image: "imgs/rke2-logo.jpeg",
            description: "Rancher Kubernetes Engine 2 - enterprise-grade Kubernetes distribution",
            category: "Enterprise K8s"
        }
    ];
    
    res.json(tools);
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        instance_id: INSTANCE_ID,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        port: PORT,
        node_version: process.version,
        memory_usage: process.memoryUsage()
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// Start the server
app.listen(PORT, () => {
    logWithInstance(`🚀 DevOps Bootcamp server is running on port ${PORT}`);
    logWithInstance(`📱 Local: http://localhost:${PORT}`);
    logWithInstance(`🌐 Network: http://0.0.0.0:${PORT}`);
    logWithInstance(`📊 Health check: http://localhost:${PORT}/health`);
    logWithInstance('---');
    logWithInstance('Available endpoints:');
    logWithInstance(`  GET  /              - Main HTML page`);
    logWithInstance(`  POST /api/contact   - Contact form submission`);
    logWithInstance(`  GET  /api/stats     - Bootcamp statistics`);
    logWithInstance(`  GET  /api/curriculum - Curriculum information`);
    logWithInstance(`  GET  /api/tools     - DevOps tools information`);
    logWithInstance(`  GET  /health        - Health check`);
    logWithInstance('---');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logWithInstance('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    logWithInstance('SIGINT received, shutting down gracefully');
    process.exit(0);
});
