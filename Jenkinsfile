pipeline {
  agent any
  stages {
    stage('Checkout code') {
      steps {
        git(url: 'https://github.com/Workaholic-Inc/backend', branch: 'main')
      }
    }

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

    stage('Scan') {
      steps {
        withSonarQubeEnv(envOnly: true, installationName: 'workaholic_backend', credentialsId: 'sonar-key') {
          sh 'bat "${scannerHome}\\\\bin\\\\sonar-scanner"'
        }

      }
    }

  }
}