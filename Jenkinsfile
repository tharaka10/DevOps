pipeline {
    agent any

    environment {
        REPO_URL = 'https://github.com/Dasundh99/DevOps_Final_Group_Project.git'
        BACKEND_IMAGE = 'devops_project-backend'
        FRONTEND_IMAGE = 'devops_project-frontend'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git url: "${REPO_URL}"
            }
        }

        stage('Cleanup Existing Containers') {
            steps {
                script {
                    bat 'docker rm -f backend frontend || true'
                }
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('Rocket-Express---backend-main') {
                    bat "docker build -t ${BACKEND_IMAGE} ."
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('Rocket-Express-main') {
                    bat "docker build -t ${FRONTEND_IMAGE} ."
                }
            }
        }

        stage('Run Containers') {
            steps {
                bat "docker run -d --name backend -p 4000:4000 ${BACKEND_IMAGE}"
                bat "docker run -d --name frontend -p 3000:3000 ${FRONTEND_IMAGE}"
            }
        }
    }
}