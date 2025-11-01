FROM jenkins/jenkins:lts-jdk17

USER root

ARG DOCKER_GID=1001

# 🧰 Core dependencies
RUN apt-get update && apt-get install -y \
    python3 python3-pip docker.io unzip wget curl jq awscli gnupg \
 && rm -rf /var/lib/apt/lists/*

# ☁️ Install kubectl
RUN curl -LO "https://dl.k8s.io/release/v1.29.4/bin/linux/amd64/kubectl" && \
    chmod +x kubectl && mv kubectl /usr/local/bin/

# 🧱 Install Terraform
RUN wget https://releases.hashicorp.com/terraform/1.6.6/terraform_1.6.6_linux_amd64.zip && \
    unzip terraform_1.6.6_linux_amd64.zip && mv terraform /usr/local/bin/ && rm terraform_1.6.6_linux_amd64.zip

# 🧠 Python packages
RUN pip3 install pytest boto3 --break-system-packages

# 🔐 Security + Quality tools
RUN curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin && \
    curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh -s -- -b /usr/local/bin

# 🧩 SonarScanner
RUN curl -sSLo sonar-scanner.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.8.0.2856-linux.zip && \
    unzip sonar-scanner.zip -d /opt && mv /opt/sonar-scanner-* /opt/sonar-scanner && \
    ln -s /opt/sonar-scanner/bin/sonar-scanner /usr/local/bin/sonar-scanner && \
    rm sonar-scanner.zip

# 🧑‍💻 Fix Docker group issue
RUN groupmod -g ${DOCKER_GID} docker || true && \
    usermod -aG docker jenkins

USER jenkins

# 🚀 Disable setup wizard
ENV JAVA_OPTS="-Djenkins.install.runSetupWizard=false"

# 👤 Auto-create admin user
COPY default-user.groovy /usr/share/jenkins/ref/init.groovy.d/default-user.groovy
