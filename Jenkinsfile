pipeline {

    agent { label "workboard" }

    environment {
        DOCKER_IMAGE_BACKEND = "workboard-backend"
        DOCKER_IMAGE_FRONTEND = "workboard-frontend"
    }

    stages {

        stage("Copy Code") {
            steps {
                echo "=========================================="
                echo "Cloning WorkBoard Repository..."
                echo "=========================================="

                git url: "https://github.com/fahadkh14/workboard.git",
                    branch: "master"
            }
        }

        stage("Environment Check") {
            steps {
                echo "Checking Build Environment..."

                sh '''
                    set -e

                    echo "Docker:"
                    docker --version

                    echo "Docker Compose:"
                    docker compose version

                    echo "Git:"
                    git --version

                    echo "Java:"
                    java -version

                    echo "Node:"
                    node --version || true

                    echo "NPM:"
                    npm --version || true
                '''
            }
        }

        stage("Security - Gitleaks") {
            steps {
                echo "=========================================="
                echo "Scanning for Hardcoded Secrets..."
                echo "=========================================="

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
                echo "=========================================="
                echo "Running Semgrep SAST..."
                echo "=========================================="

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
                echo "=========================================="
                echo "Running SonarQube Analysis..."
                echo "=========================================="

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
                echo "=========================================="
                echo "Checking SonarQube Quality Gate..."
                echo "=========================================="

                timeout(time: 5, unit: "MINUTES") {

                    script {

                        def qualityGate = waitForQualityGate()

                        echo "SonarQube Quality Gate Status: ${qualityGate.status}"

                        if (qualityGate.status != "OK") {

                            error """
                            SonarQube Quality Gate FAILED.

                            Status: ${qualityGate.status}

                            Pipeline stopped because the SonarQube
                            Quality Gate did not pass.
                            """
                        }

                        echo "SonarQube Quality Gate PASSED."
                    }
                }
            }
        }

        stage("Security - OWASP Dependency Check") {
            steps {
                echo "=========================================="
                echo "Running OWASP Dependency Check..."
                echo "=========================================="

                sh '''
                    mkdir -p dependency-check-report

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
                echo "=========================================="
                echo "Validating Docker Compose..."
                echo "=========================================="

                sh '''
                    docker compose config
                '''
            }
        }

        stage("Build Docker Images") {
            steps {
                echo "=========================================="
                echo "Building WorkBoard Docker Images..."
                echo "=========================================="

                sh '''
                    docker compose build
                '''
            }
        }

        stage("Security - Trivy Backend") {
            steps {
                echo "=========================================="
                echo "Scanning Backend Image..."
                echo "HIGH/CRITICAL vulnerabilities will STOP pipeline."
                echo "LOW/MEDIUM vulnerabilities will be ignored."
                echo "=========================================="

                sh '''
                    docker run --rm \
                    -v /var/run/docker.sock:/var/run/docker.sock \
                    aquasec/trivy:latest \
                    image \
                    --severity HIGH,CRITICAL \
                    --exit-code 1 \
                    --no-progress \
                    workboard-backend:latest
                '''
            }
        }

        stage("Security - Trivy Frontend") {
            steps {
                echo "=========================================="
                echo "Scanning Frontend Image..."
                echo "HIGH/CRITICAL vulnerabilities will STOP pipeline."
                echo "LOW/MEDIUM vulnerabilities will be ignored."
                echo "=========================================="

                sh '''
                    docker run --rm \
                    -v /var/run/docker.sock:/var/run/docker.sock \
                    aquasec/trivy:latest \
                    image \
                    --severity HIGH,CRITICAL \
                    --exit-code 1 \
                    --no-progress \
                    workboard-frontend:latest
                '''
            }
        }

        stage("Push to Docker Hub") {
            steps {

                echo "=========================================="
                echo "Pushing Images to Docker Hub..."
                echo "=========================================="

                withCredentials([
                    usernamePassword(
                        credentialsId: "dockerHubCreds",
                        usernameVariable: "dockerHubUser",
                        passwordVariable: "dockerHubPass"
                    )
                ]) {

                    sh '''
                        set -e

                        echo "Logging in to Docker Hub..."

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

                        echo "Logging out from Docker Hub..."

                        docker logout
                    '''
                }
            }
        }

        stage("Deploy") {
            steps {

                echo "=========================================="
                echo "Deploying WorkBoard Application..."
                echo "=========================================="

                sh '''
                    docker compose down || true

                    docker compose up -d

                    echo "Waiting for containers..."

                    sleep 10

                    docker compose ps
                '''
            }
        }

        stage("Health Check") {
            steps {

                echo "=========================================="
                echo "Running WorkBoard Health Check..."
                echo "=========================================="

                sh '''
                    set -e

                    sleep 5

                    echo "Running Containers:"
                    docker compose ps

                    echo "Checking Frontend..."

                    curl -f http://localhost:8070/

                    echo ""
                    echo "=========================================="
                    echo "WorkBoard Application is Healthy."
                    echo "=========================================="
                '''
            }
        }
    }

    post {

        success {
            echo "=========================================="
            echo "WORKBOARD CI/CD + DEVSECOPS SUCCESS"
            echo "=========================================="
            echo "All security checks passed."
            echo "Docker images pushed successfully."
            echo "Application deployed successfully."
        }

        failure {
            echo "=========================================="
            echo "WORKBOARD PIPELINE FAILED"
            echo "=========================================="
            echo "Check Jenkins Console Output."
            echo "=========================================="
        }

        always {
            echo "=========================================="
            echo "WORKBOARD PIPELINE COMPLETED"
            echo "=========================================="
        }
    }
}
