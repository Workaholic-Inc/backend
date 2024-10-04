pipeline {
  agent {
        label 'win-agent'
    }
  triggers {
        pollSCM '* * * * *'
    }
  environment {
      scannerHome = tool name: 'sonarscanner'
    }
  stages {
    stage('Install Packages') {

      steps {
        sh 'yarn install'
      }
    }

    stage('Test') {
      steps {
        sh 'ls -a'
      }
    }

    stage('SonarQube Analysis') {
      steps {
        withSonarQubeEnv('sonarqube_server') {
          bat "${scannerHome}\\bin\\sonar-scanner"
        }
      }
    }

  }
}