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
                    docker --version
                    docker compose version
                    git --version
                '''
            }
        }

        stage("Security - Gitleaks") {
            steps {
                echo "Scanning for Hardcoded Secrets..."

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

                withSonarQubeEnv("SonarQube") {
                    sh '''
                        sonar-scanner \
                        -Dsonar.projectKey=workboard \
                        -Dsonar.projectName=WorkBoard \
                        -Dsonar.sources=. \
                        -Dsonar.sourceEncoding=UTF-8
                    '''
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

        stage("Test") {
            steps {
                echo "Validating Docker Compose..."

                sh '''
                    docker compose config
                '''
            }
        }

        stage("Build") {
            steps {
                echo "Building WorkBoard Docker Images..."

                sh '''
                    docker compose build
                '''
            }
        }

        stage("Security - Trivy") {
            steps {
                echo "Scanning Backend Image..."

                sh '''
                    docker run --rm \
                    -v /var/run/docker.sock:/var/run/docker.sock \
                    aquasec/trivy:latest \
                    image \
                    --severity HIGH,CRITICAL \
                    --exit-code 1 \
                    workboard-backend:latest
                '''

                echo "Scanning Frontend Image..."

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

                        docker image tag \
                        workboard-backend:latest \
                        "$dockerHubUser/workboard-backend:latest"

                        docker image tag \
                        workboard-frontend:latest \
                        "$dockerHubUser/workboard-frontend:latest"

                        docker push \
                        "$dockerHubUser/workboard-backend:latest"

                        docker push \
                        "$dockerHubUser/workboard-frontend:latest"

                        docker logout
                    '''
                }
            }
        }

        stage("Deploy") {
            steps {
                echo "Deploying WorkBoard..."

                sh '''
                    docker compose up -d
                    docker compose ps
                '''
            }
        }

        stage("Health Check") {
            steps {

                echo "Checking WorkBoard Application..."

                sh '''
                    sleep 10

                    docker compose ps

                    curl -f http://localhost:8070/ || exit 1

                    echo "WorkBoard Health Check Passed."
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
            echo "WorkBoard Pipeline Completed."
        }
    }
}
