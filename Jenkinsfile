pipeline {
    agent any

    stages {

        // Clone Workboard source code from GitHub
        stage("Copy Code") {
            steps {
                echo "Cloning Workboard Repository..."

                git url: "https://github.com/fahadkh14/workboard.git",
                    branch: "master"
            }
        }

        // Build Workboard backend and frontend Docker images
        stage("Build") {
            steps {
                echo "Building Workboard Docker Images..."

                sh "docker compose build"
            }
        }

        // Validate Docker Compose configuration
        stage("Test") {
            steps {
                echo "Testing Workboard Docker Compose Configuration..."

                sh "docker compose config"
            }
        }

        // Push Workboard images to Docker Hub
        stage("Push to Docker Hub") {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "dockerHubCreds",
                    usernameVariable: "dockerHubUser",
                    passwordVariable: "dockerHubPass"
                )]) {

                    sh '''
                        echo "$dockerHubPass" | docker login -u "$dockerHubUser" --password-stdin

                        docker image tag workboard-backend:latest "$dockerHubUser/workboard-backend:latest"
                        docker image tag workboard-frontend:latest "$dockerHubUser/workboard-frontend:latest"

                        docker push "$dockerHubUser/workboard-backend:latest"
                        docker push "$dockerHubUser/workboard-frontend:latest"

                        docker logout
                    '''
                }
            }
        }

        // Deploy Workboard application using Docker Compose
        stage("Deploy") {
            steps {
                echo "Starting Workboard Application..."

                sh "docker compose up -d"

                echo "Checking Workboard Running Containers..."

                sh "docker compose ps"
            }
        }
    }
}
