pipeline {

    agent { label "workboard" }

    environment {
        DOCKER_IMAGE_BACKEND = "workboard-backend"
        DOCKER_IMAGE_FRONTEND = "workboard-frontend"
    }

    stages {

        stage("Copy Code") {
            steps {
                echo "Cloning WorkBoard Repository..."

                git url: "https://github.com/fahadkh14/workboard.git",
                    branch: "master"
            }
        }

        stage("Environment Check") {
            steps {
                echo "Checking Build Environment..."

                sh '''
                    echo "Docker:"
                    docker --version

                    echo "Docker Compose:"
                    docker compose version

                    echo "Git:"
                    git --version

                    echo "Java:"
                    java -version
                '''
            }
        }

        stage("Security - Gitleaks") {
            steps {
                echo "Scanning WorkBoard for Hardcoded Secrets..."

                sh '''
                    docker run --rm \
                    -v "$PWD:/src" \
                    ghcr.io/gitleaks/gitleaks:latest \
                    detect \
                    --source=/src \
                    --redact \
                    --exit-code 1
                '''
            }
        }

        stage("Security - Semgrep SAST") {
            steps {
                echo "Running Semgrep SAST..."

                sh '''
                    docker run --rm \
                    -v "$PWD:/src" \
                    semgrep/semgrep \
                    semgrep scan \
                    --config auto \
                    --error \
                    /src
                '''
            }
        }

        stage("Code Quality - SonarQube") {
            steps {
                echo "Running SonarQube Analysis..."

                script {

                    def scannerHome = tool "SonarScanner"

                    withSonarQubeEnv("SonarQube") {

                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=workboard \
                            -Dsonar.projectName=WorkBoard \
                            -Dsonar.sources=. \
                            -Dsonar.sourceEncoding=UTF-8
                        """
                    }
                }
            }
        }

        stage("SonarQube Quality Gate") {
            steps {
                echo "Checking SonarQube Quality Gate..."

                timeout(time: 5, unit: "MINUTES") {

                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage("Security - OWASP Dependency Check") {
            steps {
                echo "Running OWASP Dependency Check..."

                sh '''
                    docker run --rm \
                    -v "$PWD:/src" \
                    owasp/dependency-check:latest \
                    --scan /src \
                    --format HTML \
                    --format XML \
                    --out /src/dependency-check-report \
                    --project WorkBoard
                '''
            }
        }

        stage("Docker Compose Test") {
            steps {
                echo "Validating Docker Compose Configuration..."

                sh '''
                    docker compose config
                '''
            }
        }

        stage("Build Docker Images") {
            steps {
                echo "Building WorkBoard Docker Images..."

                sh '''
                    docker compose build
                '''
            }
        }

        stage("Security - Trivy Backend") {
            steps {
                echo "Scanning Backend Docker Image..."

                sh '''
                    docker run --rm \
                    -v /var/run/docker.sock:/var/run/docker.sock \
                    aquasec/trivy:latest \
                    image \
                    --severity HIGH,CRITICAL \
                    --exit-code 1 \
                    workboard-backend:latest
                '''
            }
        }

        stage("Security - Trivy Frontend") {
            steps {
                echo "Scanning Frontend Docker Image..."

                sh '''
                    docker run --rm \
                    -v /var/run/docker.sock:/var/run/docker.sock \
                    aquasec/trivy:latest \
                    image \
                    --severity HIGH,CRITICAL \
                    --exit-code 1 \
                    workboard-frontend:latest
                '''
            }
        }

        stage("Push to Docker Hub") {
            steps {

                withCredentials([
                    usernamePassword(
                        credentialsId: "dockerHubCreds",
                        usernameVariable: "dockerHubUser",
                        passwordVariable: "dockerHubPass"
                    )
                ]) {

                    sh '''
                        echo "$dockerHubPass" | \
                        docker login \
                        -u "$dockerHubUser" \
                        --password-stdin

                        echo "Tagging Backend Image..."

                        docker image tag \
                        workboard-backend:latest \
                        "$dockerHubUser/workboard-backend:latest"

                        echo "Tagging Frontend Image..."

                        docker image tag \
                        workboard-frontend:latest \
                        "$dockerHubUser/workboard-frontend:latest"

                        echo "Pushing Backend Image..."

                        docker push \
                        "$dockerHubUser/workboard-backend:latest"

                        echo "Pushing Frontend Image..."

                        docker push \
                        "$dockerHubUser/workboard-frontend:latest"

                        docker logout
                    '''
                }
            }
        }

        stage("Deploy") {
            steps {

                echo "Deploying WorkBoard Application..."

                sh '''
                    docker compose down || true

                    docker compose up -d

                    docker compose ps
                '''
            }
        }

        stage("Health Check") {
            steps {

                echo "Checking WorkBoard Application Health..."

                sh '''
                    sleep 10

                    echo "Running Containers:"
                    docker compose ps

                    echo "Checking Frontend..."

                    curl -f http://localhost:8070/ || exit 1

                    echo "WorkBoard Application is Healthy."
                '''
            }
        }
    }

    post {

        success {
            echo "=========================================="
            echo "WORKBOARD CI/CD + DEVSECOPS SUCCESS"
            echo "=========================================="
        }

        failure {
            echo "=========================================="
            echo "WORKBOARD PIPELINE FAILED"
            echo "CHECK JENKINS CONSOLE OUTPUT"
            echo "=========================================="
        }

        always {
            echo "=========================================="
            echo "WORKBOARD PIPELINE COMPLETED"
            echo "=========================================="
        }
    }
}
