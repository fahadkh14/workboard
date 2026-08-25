```groovy
pipeline {

    agent { label "workboard" }

    stages {

        // ============================================================
        // 1. Clone DeployGuard source code from GitHub
        // ============================================================
        stage("Copy Code") {
            steps {
                echo "Cloning DeployGuard Repository..."

                git url: "https://github.com/fahadkh14/deployguard.git",
                    branch: "main"
            }
        }

        // ============================================================
        // 2. Check Environment
        // ============================================================
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

        // ============================================================
        // 3. Secret Scanning - Gitleaks
        // ============================================================
        stage("Secret Scan - Gitleaks") {
            steps {
                echo "Scanning Repository for Secrets..."

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

        // ============================================================
        // 4. SAST - Semgrep
        // ============================================================
        stage("SAST - Semgrep") {
            steps {
                echo "Running Static Application Security Testing..."

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

        // ============================================================
        // 5. SonarQube Code Quality
        // ============================================================
        stage("SonarQube Analysis") {
            steps {
                echo "Running SonarQube Code Quality Analysis..."

                withSonarQubeEnv("SonarQube") {
                    sh '''
                        sonar-scanner \
                        -Dsonar.projectKey=deployguard \
                        -Dsonar.projectName=DeployGuard \
                        -Dsonar.sources=.
                    '''
                }
            }
        }

        // ============================================================
        // 6. Validate Docker Compose
        // ============================================================
        stage("Test") {
            steps {
                echo "Validating Docker Compose Configuration..."

                sh "docker compose config"
            }
        }

        // ============================================================
        // 7. Build Docker Images
        // ============================================================
        stage("Build") {
            steps {
                echo "Building DeployGuard Docker Images..."

                sh "docker compose build"
            }
        }

        // ============================================================
        // 8. Trivy Container Security Scan
        // ============================================================
        stage("Container Security Scan - Trivy") {
            steps {
                echo "Scanning Docker Images for Vulnerabilities..."

                sh '''
                    BACKEND_IMAGE=$(docker compose images -q backend)
                    FRONTEND_IMAGE=$(docker compose images -q frontend)

                    echo "Scanning Backend Image..."
                    docker run --rm \
                    -v /var/run/docker.sock:/var/run/docker.sock \
                    aquasec/trivy:latest \
                    image \
                    --severity HIGH,CRITICAL \
                    --exit-code 1 \
                    "$BACKEND_IMAGE"

                    echo "Scanning Frontend Image..."
                    docker run --rm \
                    -v /var/run/docker.sock:/var/run/docker.sock \
                    aquasec/trivy:latest \
                    image \
                    --severity HIGH,CRITICAL \
                    --exit-code 1 \
                    "$FRONTEND_IMAGE"
                '''
            }
        }

        // ============================================================
        // 9. Push Images to Docker Hub
        // ============================================================
        stage("Push to Docker Hub") {
            steps {

                withCredentials([usernamePassword(
                    credentialsId: "dockerHubCreds",
                    usernameVariable: "dockerHubUser",
                    passwordVariable: "dockerHubPass"
                )]) {

                    sh '''
                        echo "$dockerHubPass" | \
                        docker login \
                        -u "$dockerHubUser" \
                        --password-stdin

                        docker image tag deployguard-backend:latest \
                        "$dockerHubUser/deployguard-backend:latest"

                        docker image tag deployguard-frontend:latest \
                        "$dockerHubUser/deployguard-frontend:latest"

                        docker push \
                        "$dockerHubUser/deployguard-backend:latest"

                        docker push \
                        "$dockerHubUser/deployguard-frontend:latest"

                        docker logout
                    '''
                }
            }
        }

        // ============================================================
        // 10. Deploy Application
        // ============================================================
        stage("Deploy") {
            steps {
                echo "Starting DeployGuard Application..."

                sh "docker compose up -d"

                echo "Checking DeployGuard Running Containers..."

                sh "docker compose ps"
            }
        }

        // ============================================================
        // 11. Health Check
        // ============================================================
        stage("Health Check") {
            steps {
                echo "Checking Application Health..."

                sh '''
                    sleep 10

                    docker compose ps

                    echo "Checking Frontend..."

                    curl -f http://localhost:8070/ || exit 1

                    echo "DeployGuard Health Check Passed."
                '''
            }
        }
    }

    post {

        success {
            echo "======================================"
            echo "DeployGuard Pipeline SUCCESS"
            echo "CI/CD + DevSecOps Completed"
            echo "======================================"
        }

        failure {
            echo "======================================"
            echo "DeployGuard Pipeline FAILED"
            echo "Check Jenkins Console Output"
            echo "======================================"
        }

        always {
            echo "Pipeline execution completed."
        }
    }
}
```
